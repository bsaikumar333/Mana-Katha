const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'manakatha.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Helper for running queries with promises
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

// Helper for fetching all records
const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Helper for fetching single record
const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const initializeDatabase = async () => {
  // Create tables
  await runQuery(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL
    )
  `);

  await runQuery(`
    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image_url TEXT,
      is_available INTEGER DEFAULT 1,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )
  `);

  // Seed Admin user if not exists
  const adminExists = await getQuery('SELECT * FROM users WHERE username = ?', ['admin']);
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('manakatha123', 10);
    await runQuery('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
    console.log('Admin user seeded (admin / manakatha123).');
  }

  // Seed Categories if empty
  const categoriesCount = await getQuery('SELECT count(*) as count FROM categories');
  if (categoriesCount.count === 0) {
    await runQuery('INSERT INTO categories (name, slug) VALUES (?, ?)', ['Hot Brews', 'hot-brews']);
    await runQuery('INSERT INTO categories (name, slug) VALUES (?, ?)', ['Cold Brews', 'cold-brews']);
    await runQuery('INSERT INTO categories (name, slug) VALUES (?, ?)', ['Quick Bites', 'quick-bites']);
    console.log('Categories seeded.');
  }

  // Seed Menu Items if empty
  const itemsCount = await getQuery('SELECT count(*) as count FROM menu_items');
  if (itemsCount.count === 0) {
    const hotBrews = await getQuery("SELECT id FROM categories WHERE slug = 'hot-brews'");
    const coldBrews = await getQuery("SELECT id FROM categories WHERE slug = 'cold-brews'");
    const quickBites = await getQuery("SELECT id FROM categories WHERE slug = 'quick-bites'");

    const items = [
      // Hot Brews
      { category_id: hotBrews.id, name: 'Classic Espresso', description: 'Rich, bold, and intense single shot of espresso.', price: 120, image_url: '/assets/espresso.jpg', is_available: 1 },
      { category_id: hotBrews.id, name: 'Cappuccino', description: 'Perfect balance of espresso, steamed milk, and velvety foam.', price: 160, image_url: '/assets/cappuccino.jpg', is_available: 1 },
      { category_id: hotBrews.id, name: 'Caffe Latte', description: 'Smooth espresso with plenty of steamed milk and a light layer of foam.', price: 180, image_url: '/assets/latte.jpg', is_available: 1 },
      
      // Cold Brews
      { category_id: coldBrews.id, name: 'Signature Cold Brew', description: 'Slow-steeped for 18 hours for an exceptionally smooth, low-acid coffee.', price: 190, image_url: '/assets/cold-brew.jpg', is_available: 1 },
      { category_id: coldBrews.id, name: 'Iced Caramel Macchiato', description: 'Espresso combined with milk, caramel syrup, and topped with caramel drizzle.', price: 210, image_url: '/assets/iced-caramel.jpg', is_available: 1 },
      { category_id: coldBrews.id, name: 'Hazelnut Frappe', description: 'Blended coffee with milk, hazelnut syrup, ice, and whipped cream.', price: 230, image_url: '/assets/frappe.jpg', is_available: 1 },

      // Quick Bites
      { category_id: quickBites.id, name: 'Butter Croissant', description: 'Flaky, buttery, and freshly baked classic French pastry.', price: 140, image_url: '/assets/croissant.jpg', is_available: 1 },
      { category_id: quickBites.id, name: 'Blueberry Muffin', description: 'Soft and moist muffin loaded with juicy blueberries.', price: 150, image_url: '/assets/muffin.jpg', is_available: 1 },
      { category_id: quickBites.id, name: 'Paneer Tikka Sandwich', description: 'Spiced paneer cubes, veggies, and mint chutney in grilled bread.', price: 180, image_url: '/assets/sandwich.jpg', is_available: 1 }
    ];

    for (const item of items) {
      await runQuery(
        'INSERT INTO menu_items (category_id, name, description, price, image_url, is_available) VALUES (?, ?, ?, ?, ?, ?)',
        [item.category_id, item.name, item.description, item.price, item.image_url, item.is_available]
      );
    }
    console.log('Menu items seeded.');
  }
};

module.exports = {
  db,
  runQuery,
  allQuery,
  getQuery,
  initializeDatabase
};
