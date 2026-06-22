const express = require('express');
const router = express.Router();
const { runQuery, allQuery, getQuery } = require('../database');
const authMiddleware = require('../middleware/auth');

// Utility to generate slug from name
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};

// ==========================================
// PUBLIC ROUTES
// ==========================================

// Get all menu categories and items (hierarchical structure)
router.get('/', async (req, res) => {
  try {
    const categories = await allQuery('SELECT * FROM categories ORDER BY name ASC');
    const items = await allQuery('SELECT * FROM menu_items ORDER BY name ASC');

    const menu = categories.map((cat) => {
      return {
        ...cat,
        items: items.filter((item) => item.category_id === cat.id)
      };
    });

    res.json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving menu.' });
  }
});

// Get just categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await allQuery('SELECT * FROM categories ORDER BY name ASC');
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving categories.' });
  }
});

// ==========================================
// PROTECTED ROUTES (Requires authMiddleware)
// ==========================================

// --- CATEGORIES CRUD ---

// Add a category
router.post('/categories', authMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Category name is required.' });
  }

  const slug = slugify(name);
  try {
    const existing = await getQuery('SELECT * FROM categories WHERE slug = ?', [slug]);
    if (existing) {
      return res.status(400).json({ message: 'Category already exists.' });
    }

    const result = await runQuery('INSERT INTO categories (name, slug) VALUES (?, ?)', [name, slug]);
    res.status(201).json({ id: result.lastID, name, slug });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating category.' });
  }
});

// Edit a category
router.put('/categories/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required.' });
  }

  const slug = slugify(name);
  try {
    const existing = await getQuery('SELECT * FROM categories WHERE slug = ? AND id != ?', [slug, id]);
    if (existing) {
      return res.status(400).json({ message: 'Another category with this name already exists.' });
    }

    await runQuery('UPDATE categories SET name = ?, slug = ? WHERE id = ?', [name, slug, id]);
    res.json({ id: Number(id), name, slug });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating category.' });
  }
});

// Delete a category (and cascade to menu items via DB schema)
router.delete('/categories/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    // Enable foreign keys explicitly in SQLite for cascade deletes
    await runQuery('PRAGMA foreign_keys = ON');
    await runQuery('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ message: 'Category and its related menu items deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting category.' });
  }
});

// --- MENU ITEMS CRUD ---

// Add a menu item
router.post('/items', authMiddleware, async (req, res) => {
  const { category_id, name, description, price, image_url, is_available } = req.body;

  if (!category_id || !name || price === undefined) {
    return res.status(400).json({ message: 'Category ID, Name, and Price are required.' });
  }

  try {
    // Check if category exists
    const category = await getQuery('SELECT * FROM categories WHERE id = ?', [category_id]);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category ID.' });
    }

    const availableVal = is_available === undefined ? 1 : (is_available ? 1 : 0);
    const result = await runQuery(
      'INSERT INTO menu_items (category_id, name, description, price, image_url, is_available) VALUES (?, ?, ?, ?, ?, ?)',
      [category_id, name, description || '', price, image_url || '', availableVal]
    );

    res.status(201).json({
      id: result.lastID,
      category_id,
      name,
      description: description || '',
      price,
      image_url: image_url || '',
      is_available: availableVal
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating menu item.' });
  }
});

// Edit a menu item
router.put('/items/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { category_id, name, description, price, image_url, is_available } = req.body;

  if (!category_id || !name || price === undefined) {
    return res.status(400).json({ message: 'Category ID, Name, and Price are required.' });
  }

  try {
    const item = await getQuery('SELECT * FROM menu_items WHERE id = ?', [id]);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    const availableVal = is_available === undefined ? 1 : (is_available ? 1 : 0);
    await runQuery(
      'UPDATE menu_items SET category_id = ?, name = ?, description = ?, price = ?, image_url = ?, is_available = ? WHERE id = ?',
      [category_id, name, description || '', price, image_url || '', availableVal, id]
    );

    res.json({
      id: Number(id),
      category_id,
      name,
      description: description || '',
      price,
      image_url: image_url || '',
      is_available: availableVal
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating menu item.' });
  }
});

// Delete a menu item
router.delete('/items/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await runQuery('DELETE FROM menu_items WHERE id = ?', [id]);
    res.json({ message: 'Menu item deleted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting menu item.' });
  }
});

module.exports = router;
