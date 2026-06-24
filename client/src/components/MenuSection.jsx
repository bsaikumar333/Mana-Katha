import React, { useState, useEffect } from 'react';
import { Coffee, Flame, RotateCcw, Plus, Check } from 'lucide-react';
import API_BASE_URL from '../apiConfig';

export default function MenuSection({ preOrderItems, onTogglePreOrder }) {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/menu`);
      if (!res.ok) throw new Error('Failed to fetch menu.');
      const data = await res.json();
      setMenu(data);
      if (data.length > 0) {
        setCategories(data);
        setActiveCategory(data[0].id);
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not load menu. Using sample menu offline.');
      // Fallback local menu data if backend is offline
      const fallbackData = [
        {
          id: 1, name: 'Hot Brews', slug: 'hot-brews', items: [
            { id: 101, name: 'Classic Espresso', description: 'Rich, bold, and intense single shot of espresso.', price: 120, is_available: 1 },
            { id: 102, name: 'Cappuccino', description: 'Perfect balance of espresso, steamed milk, and velvety foam.', price: 160, is_available: 1 },
            { id: 103, name: 'Caffe Latte', description: 'Smooth espresso with plenty of steamed milk and a light layer of foam.', price: 180, is_available: 1 }
          ]
        },
        {
          id: 2, name: 'Cold Brews', slug: 'cold-brews', items: [
            { id: 201, name: 'Signature Cold Brew', description: 'Slow-steeped for 18 hours for an exceptionally smooth, low-acid coffee.', price: 190, is_available: 1 },
            { id: 202, name: 'Iced Caramel Macchiato', description: 'Espresso combined with milk, caramel syrup, and topped with caramel drizzle.', price: 210, is_available: 1 },
            { id: 203, name: 'Hazelnut Frappe', description: 'Blended coffee with milk, hazelnut syrup, ice, and whipped cream.', price: 230, is_available: 1 }
          ]
        },
        {
          id: 3, name: 'Quick Bites', slug: 'quick-bites', items: [
            { id: 301, name: 'Butter Croissant', description: 'Flaky, buttery, and freshly baked classic French pastry.', price: 140, is_available: 1 },
            { id: 302, name: 'Blueberry Muffin', description: 'Soft and moist muffin loaded with juicy blueberries.', price: 150, is_available: 1 },
            { id: 303, name: 'Paneer Tikka Sandwich', description: 'Spiced paneer cubes, veggies, and mint chutney in grilled bread.', price: 180, is_available: 1 }
          ]
        }
      ];
      setMenu(fallbackData);
      setCategories(fallbackData);
      setActiveCategory(fallbackData[0].id);
    } finally {
      setLoading(false);
    }
  };

  const activeCategoryData = menu.find((cat) => cat.id === activeCategory);

  return (
    <section id="menu" className="relative z-20 py-24 bg-[#0a1128]/35 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center items-center gap-1.5 mb-3 text-gold-400">
            <Flame className="w-5 h-5" />
            <span className="text-sm uppercase tracking-widest font-semibold font-serif">Curated Gastronomy</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-white font-semibold mb-6">
            Explore the Mana Katha Menu
          </h2>
          <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mb-6" />
          <p className="text-coffee-300">
            Every cup and bite has a story. Select your favorites and pre-order them directly with your table reservation.
          </p>
        </div>

        {/* Category Tabs */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-gold-500 text-coffee-950 font-semibold shadow-lg shadow-gold-500/10'
                    : 'bg-coffee-900/60 text-coffee-200 border border-coffee-800 hover:border-gold-500/40 hover:bg-coffee-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* Menu Items Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-400" />
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-gold-400/80 text-sm mb-4">{error}</p>
            <button 
              onClick={fetchMenu} 
              className="inline-flex items-center gap-2 text-xs text-gold-300 hover:text-gold-100 border border-gold-500/30 px-4 py-2 rounded-full transition-all"
            >
              <RotateCcw className="w-3 h-3" /> Retry Connection
            </button>
          </div>
        ) : null}

        {!loading && activeCategoryData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeCategoryData.items && activeCategoryData.items.length > 0 ? (
              activeCategoryData.items.map((item) => {
                const isSelected = preOrderItems.some((p) => p.id === item.id);
                return (
                  <div
                    key={item.id}
                    className={`glass rounded-2xl overflow-hidden hover-card-gold flex flex-col justify-between ${
                      !item.is_available ? 'opacity-60' : ''
                    }`}
                  >
                    {/* Visual Card Top */}
                    <div>
                      {/* Stylized Cover Header */}
                      <div className="relative h-48 w-full bg-coffee-900/80 overflow-hidden flex items-center justify-center border-b border-coffee-900">
                        {/* Fallback pattern design */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-coffee-950 to-coffee-900 flex items-center justify-center">
                          <Coffee className="w-16 h-16 text-coffee-800/40" />
                        </div>
                        {/* Styled visual initial circle */}
                        <div className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full glass-light flex items-center justify-center border border-gold-500/20 text-gold-400 font-serif font-bold text-lg select-none">
                          {item.name.charAt(0)}
                        </div>
                        {!item.is_available && (
                          <div className="absolute top-4 right-4 bg-red-950/80 text-red-400 text-xs px-3 py-1 rounded-full border border-red-500/30 font-medium">
                            Unavailable
                          </div>
                        )}
                        <span className="absolute bottom-4 right-4 z-10 text-xl font-bold font-serif text-gold-300 bg-coffee-950/90 border border-gold-500/20 px-3 py-1 rounded-lg">
                          ₹{item.price}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-white mb-2">{item.name}</h3>
                        <p className="text-coffee-300 text-sm leading-relaxed min-h-[40px]">
                          {item.description || 'Artisanal recipe handcrafted fresh to order.'}
                        </p>
                      </div>
                    </div>

                    {/* Pre-order trigger */}
                    <div className="p-6 pt-0">
                      <button
                        onClick={() => item.is_available && onTogglePreOrder(item)}
                        disabled={!item.is_available}
                        className={`w-full py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                          isSelected
                            ? 'bg-gold-500 text-coffee-950 hover:bg-gold-400'
                            : 'bg-coffee-900 text-gold-400 hover:bg-coffee-800/80 border border-gold-500/10'
                        } ${!item.is_available ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-4 h-4" /> Added to Pre-order
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" /> Add to Pre-order
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12 text-coffee-400">
                No items found in this category.
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
