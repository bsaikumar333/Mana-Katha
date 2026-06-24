import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, LogOut, Coffee, Check, X, RefreshCw, Layers } from 'lucide-react';

export default function AdminDashboard({ token, onLogout }) {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modals state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ id: null, name: '' });

  const [showItemModal, setShowItemModal] = useState(false);
  const [itemForm, setItemForm] = useState({
    id: null,
    category_id: '',
    name: '',
    description: '',
    price: '',
    image_url: '',
    is_available: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      // Fetch categories
      const catRes = await fetch('http://localhost:5000/api/menu/categories');
      if (!catRes.ok) throw new Error('Failed to load categories.');
      const catData = await catRes.json();
      setCategories(catData);

      // Fetch all categories + items to flatten items
      const menuRes = await fetch('http://localhost:5000/api/menu');
      if (!menuRes.ok) throw new Error('Failed to load menu items.');
      const menuData = await menuRes.json();
      
      // Extract all items from nested hierarchy
      let allItems = [];
      menuData.forEach((cat) => {
        if (cat.items) {
          allItems = [...allItems, ...cat.items];
        }
      });
      setMenuItems(allItems);

      if (catData.length > 0 && !activeCategory) {
        setActiveCategory(catData[0].id);
      }
    } catch (err) {
      console.error(err);
      setError('Connection failed. Database offline.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, isSuccess = true) => {
    if (isSuccess) {
      setSuccess(message);
      setTimeout(() => setSuccess(''), 4000);
    } else {
      setError(message);
      setTimeout(() => setError(''), 4000);
    }
  };

  // --- Category Handlers ---
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    try {
      setLoading(true);
      const isEdit = categoryForm.id !== null;
      const url = isEdit 
        ? `http://localhost:5000/api/menu/categories/${categoryForm.id}`
        : 'http://localhost:5000/api/menu/categories';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: categoryForm.name })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save category.');

      showNotification(`Category "${categoryForm.name}" ${isEdit ? 'updated' : 'created'} successfully!`);
      setShowCategoryModal(false);
      setCategoryForm({ id: null, name: '' });
      await fetchData();
    } catch (err) {
      showNotification(err.message, false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (catId, catName) => {
    if (!window.confirm(`Are you sure you want to delete the category "${catName}"? This will delete all associated menu items.`)) return;

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/menu/categories/${catId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to delete category.');

      showNotification(`Category "${catName}" and its items deleted.`);
      if (activeCategory === catId) {
        setActiveCategory(null);
      }
      await fetchData();
    } catch (err) {
      showNotification(err.message, false);
    } finally {
      setLoading(false);
    }
  };

  // --- Menu Item Handlers ---
  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!itemForm.name.trim() || !itemForm.price || !itemForm.category_id) {
      showNotification('Please fill in all required fields.', false);
      return;
    }

    try {
      setLoading(true);
      const isEdit = itemForm.id !== null;
      const url = isEdit 
        ? `http://localhost:5000/api/menu/items/${itemForm.id}`
        : 'http://localhost:5000/api/menu/items';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category_id: Number(itemForm.category_id),
          name: itemForm.name,
          description: itemForm.description,
          price: Number(itemForm.price),
          image_url: itemForm.image_url,
          is_available: itemForm.is_available
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save item.');

      showNotification(`Menu item "${itemForm.name}" ${isEdit ? 'updated' : 'added'} successfully!`);
      setShowItemModal(false);
      setItemForm({ id: null, category_id: '', name: '', description: '', price: '', image_url: '', is_available: true });
      await fetchData();
    } catch (err) {
      showNotification(err.message, false);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId, itemName) => {
    if (!window.confirm(`Are you sure you want to delete "${itemName}"?`)) return;

    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/menu/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to delete item.');

      showNotification(`Item "${itemName}" deleted.`);
      await fetchData();
    } catch (err) {
      showNotification(err.message, false);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      const res = await fetch(`http://localhost:5000/api/menu/items/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category_id: item.category_id,
          name: item.name,
          description: item.description,
          price: item.price,
          image_url: item.image_url,
          is_available: !item.is_available
        })
      });

      if (!res.ok) throw new Error('Failed to toggle status.');
      
      showNotification(`"${item.name}" availability updated.`);
      await fetchData();
    } catch (err) {
      showNotification(err.message, false);
    }
  };

  const filteredItems = menuItems.filter((item) => item.category_id === activeCategory);

  return (
    <div className="min-h-screen bg-transparent text-coffee-100 pb-20 select-none">
      
      {/* Header Admin Navbar */}
      <nav className="glass sticky top-0 z-30 border-b border-coffee-900 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/logo.jpg" 
            alt="Mana Katha Logo" 
            className="w-10 h-10 object-cover rounded-full border border-gold-500/30"
          />
          <div>
            <h1 className="font-serif font-bold text-white text-lg tracking-wide">Mana Katha Dashboard</h1>
            <p className="text-[10px] text-gold-400 font-semibold uppercase tracking-widest">Administrator Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={fetchData} 
            className="p-2 text-coffee-300 hover:text-white rounded-lg hover:bg-coffee-900 transition-all"
            title="Refresh database"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-950/40 text-red-400 border border-red-950 hover:bg-red-500/15 rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      {/* Main Grid Workspace */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Status Alerts */}
        <div className="lg:col-span-12 space-y-4">
          {error && (
            <div className="p-4 bg-red-950/40 border border-red-500/20 text-red-400 text-sm rounded-xl text-center font-medium animate-fade-in flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError('')}><X className="w-4 h-4" /></button>
            </div>
          )}
          {success && (
            <div className="p-4 bg-green-950/40 border border-green-500/20 text-green-400 text-sm rounded-xl text-center font-medium animate-fade-in flex justify-between items-center">
              <span>{success}</span>
              <button onClick={() => setSuccess('')}><X className="w-4 h-4" /></button>
            </div>
          )}
        </div>

        {/* LEFT COLUMN: Categories Operations */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-gold-400" /> Categories
              </h3>
              <button
                onClick={() => {
                  setCategoryForm({ id: null, name: '' });
                  setShowCategoryModal(true);
                }}
                className="p-2 bg-gold-500/10 text-gold-400 border border-gold-500/20 rounded-lg hover:bg-gold-500 hover:text-coffee-950 transition-all flex items-center gap-1.5 text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {/* Categories list */}
            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`p-4 rounded-xl flex justify-between items-center border transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-coffee-900/60 border-gold-500/30'
                      : 'bg-transparent border-coffee-900 hover:border-coffee-800'
                  }`}
                >
                  <span className="font-medium text-sm text-coffee-100">{cat.name}</span>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setCategoryForm({ id: cat.id, name: cat.name });
                        setShowCategoryModal(true);
                      }}
                      className="p-1.5 text-coffee-400 hover:text-gold-400 hover:bg-coffee-900 rounded-md transition-all"
                      title="Edit Category Name"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1.5 text-coffee-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {categories.length === 0 && (
                <p className="text-xs text-coffee-400 text-center py-4">No categories created yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Items List */}
        <div className="lg:col-span-8">
          <div className="glass rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-lg font-bold text-white">
                {categories.find((c) => c.id === activeCategory)?.name || 'Menu Items'}
              </h3>
              
              {activeCategory && (
                <button
                  onClick={() => {
                    setItemForm({
                      id: null,
                      category_id: activeCategory,
                      name: '',
                      description: '',
                      price: '',
                      image_url: '',
                      is_available: true
                    });
                    setShowItemModal(true);
                  }}
                  className="px-4 py-2.5 bg-gold-500 hover:bg-gold-400 text-coffee-950 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold"
                >
                  <Plus className="w-4 h-4" /> Add Menu Item
                </button>
              )}
            </div>

            {/* Menu Items Table / List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-coffee-200">
                <thead className="text-xs uppercase bg-coffee-900/60 text-coffee-400 border-b border-coffee-800">
                  <tr>
                    <th className="py-3 px-4">Item details</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-coffee-900/40">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-coffee-900/20 transition-all">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-coffee-900 border border-gold-500/10 flex items-center justify-center font-bold text-gold-400 text-xs">
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{item.name}</p>
                            <p className="text-xs text-coffee-400 truncate max-w-xs">{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-medium text-gold-300">₹{item.price}</td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => handleToggleAvailability(item)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            item.is_available
                              ? 'bg-green-950/60 text-green-400 border border-green-500/20'
                              : 'bg-red-950/60 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {item.is_available ? 'Available' : 'Unavailable'}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setItemForm({
                                id: item.id,
                                category_id: item.category_id,
                                name: item.name,
                                description: item.description,
                                price: item.price,
                                image_url: item.image_url,
                                is_available: item.is_available === 1 || item.is_available === true
                              });
                              setShowItemModal(true);
                            }}
                            className="p-2 text-coffee-400 hover:text-gold-400 hover:bg-coffee-900 rounded-lg transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.name)}
                            className="p-2 text-coffee-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-coffee-400 text-xs">
                        No menu items created in this category.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* --- Category Modal --- */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-fade-in border border-gold-500/25">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-serif text-lg font-bold text-white">
                {categoryForm.id ? 'Edit Category' : 'Add Category'}
              </h4>
              <button onClick={() => setShowCategoryModal(false)} className="text-coffee-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-coffee-300 mb-2">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Desserts"
                  className="w-full px-4 py-3 bg-coffee-900 border border-coffee-800 rounded-xl text-white focus:outline-none focus:border-gold-500 text-sm font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-coffee-950 font-bold uppercase tracking-wider transition-all text-xs flex justify-center"
              >
                {loading ? 'Saving...' : 'Save Category'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- Menu Item Modal --- */}
      {showItemModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass rounded-3xl w-full max-w-md p-6 shadow-2xl animate-fade-in border border-gold-500/25">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-serif text-lg font-bold text-white">
                {itemForm.id ? 'Edit Menu Item' : 'Add Menu Item'}
              </h4>
              <button onClick={() => setShowItemModal(false)} className="text-coffee-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveItem} className="space-y-4">
              {/* Category Select */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-coffee-300 mb-2">Category</label>
                <select
                  required
                  value={itemForm.category_id}
                  onChange={(e) => setItemForm({ ...itemForm, category_id: e.target.value })}
                  className="w-full px-4 py-3 bg-coffee-900 border border-coffee-800 rounded-xl text-white focus:outline-none focus:border-gold-500 text-sm"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-coffee-300 mb-2">Item Name</label>
                <input
                  type="text"
                  required
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  placeholder="e.g. Iced Latte"
                  className="w-full px-4 py-3 bg-coffee-900 border border-coffee-800 rounded-xl text-white focus:outline-none focus:border-gold-500 text-sm"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-coffee-300 mb-2">Price (INR)</label>
                <input
                  type="number"
                  required
                  value={itemForm.price}
                  onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                  placeholder="e.g. 180"
                  className="w-full px-4 py-3 bg-coffee-900 border border-coffee-800 rounded-xl text-white focus:outline-none focus:border-gold-500 text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-coffee-300 mb-2">Description</label>
                <textarea
                  value={itemForm.description}
                  onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  placeholder="Describe the brew flavor, key ingredients, etc."
                  rows="2"
                  className="w-full px-4 py-3 bg-coffee-900 border border-coffee-800 rounded-xl text-white focus:outline-none focus:border-gold-500 text-sm resize-none"
                />
              </div>

              {/* Available Toggle */}
              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="is_available"
                  checked={itemForm.is_available}
                  onChange={(e) => setItemForm({ ...itemForm, is_available: e.target.checked })}
                  className="w-4 h-4 rounded accent-gold-500 focus:ring-gold-500 bg-coffee-900 border-coffee-800"
                />
                <label htmlFor="is_available" className="text-xs uppercase tracking-wider text-coffee-300 select-none cursor-pointer">
                  Available in store
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-coffee-950 font-bold uppercase tracking-wider transition-all text-xs flex justify-center"
              >
                {loading ? 'Saving...' : 'Save Menu Item'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
