import React, { useState, useEffect } from 'react';
import { Coffee, Menu, X, ArrowUp, ShoppingCart, Lock } from 'lucide-react';
import HeroSection from './components/HeroSection';
import MenuSection from './components/MenuSection';
import RooftopEvents from './components/RooftopEvents';
import TableBooking from './components/TableBooking';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import API_BASE_URL from './apiConfig';

export default function App() {
  const [view, setView] = useState('home'); // 'home', 'admin-login', 'admin-dashboard'
  const [token, setToken] = useState(localStorage.getItem('manakatha_token') || '');
  const [user, setUser] = useState(null);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [preOrderItems, setPreOrderItems] = useState([]);

  // Check auth token validity on load
  useEffect(() => {
    if (token) {
      verifyToken(token);
    }
  }, [token]);

  // Handle scroll trigger for navbar and back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const verifyToken = async (authToken) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        // If owner is already authenticated and visits, they can jump straight to dashboard
        if (view === 'admin-login') {
          setView('admin-dashboard');
        }
      } else {
        // Token invalid, clear it
        handleLogout();
      }
    } catch (err) {
      console.error('Error verifying token:', err);
    }
  };

  const handleLoginSuccess = (authToken, loggedInUser) => {
    setToken(authToken);
    setUser(loggedInUser);
    setView('admin-dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('manakatha_token');
    localStorage.removeItem('manakatha_user');
    setToken('');
    setUser(null);
    setView('home');
  };

  // --- Pre-order Handlers ---
  const handleTogglePreOrder = (item) => {
    setPreOrderItems((prev) => {
      const exists = prev.some((p) => p.id === item.id);
      if (exists) {
        return prev.filter((p) => p.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleRemovePreOrder = (itemId) => {
    setPreOrderItems((prev) => prev.filter((p) => p.id !== itemId));
  };

  const handleClearPreOrder = () => {
    setPreOrderItems([]);
  };

  // Scroll to section helper
  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Render view router
  if (view === 'admin-login') {
    return (
      <AdminLogin 
        onLoginSuccess={handleLoginSuccess} 
        onGoHome={() => setView('home')} 
      />
    );
  }

  if (view === 'admin-dashboard') {
    return (
      <AdminDashboard 
        token={token} 
        onLogout={handleLogout} 
      />
    );
  }

  return (
    <div className="relative bg-transparent min-h-screen text-coffee-100">
      
      {/* Dynamic Header / Navbar */}
      <header className="fixed top-0 left-0 w-full z-40 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img 
              src="/assets/logo.jpg" 
              alt="Mana Katha Logo" 
              className="w-12 h-12 object-cover rounded-full border border-gold-500/30 shadow-md shadow-gold-500/10"
            />
            <div>
              <span className="font-serif font-bold text-white text-xl tracking-wider block leading-none">MANA KATHA</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-gold-400 font-semibold leading-none mt-1 block">Cafe & Restaurant</span>
            </div>
          </div>

          {/* Desktop Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-sm font-medium hover:text-gold-400 tracking-wider transition-all">Home</button>
            <button onClick={() => scrollTo('menu')} className="text-sm font-medium hover:text-gold-400 tracking-wider transition-all">Menu</button>
            <button onClick={() => scrollTo('rooftop')} className="text-sm font-medium hover:text-gold-400 tracking-wider transition-all">Rooftop & Events</button>
            <button onClick={() => scrollTo('booking')} className="text-sm font-medium hover:text-gold-400 tracking-wider transition-all">Bookings</button>
          </nav>

          {/* Table Booking Header Button */}
          <div className="hidden md:flex items-center gap-4">
            {preOrderItems.length > 0 && (
              <a 
                href="#booking" 
                onClick={() => scrollTo('booking')} 
                className="flex items-center gap-2 px-3 py-1.5 bg-coffee-900 border border-gold-500/20 text-gold-400 hover:text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Pre-orders ({preOrderItems.length})</span>
              </a>
            )}
            
            <button 
              onClick={() => scrollTo('booking')}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-coffee-950 hover:from-gold-400 hover:to-gold-500 text-sm font-semibold tracking-wider transition-all"
            >
              Reserve Table
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-coffee-300 hover:text-white hover:bg-coffee-900 rounded-xl transition-all"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-b border-coffee-900 px-6 py-8 space-y-6 flex flex-col animate-fade-in select-none">
            <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenuOpen(false); }} className="text-left text-lg font-medium hover:text-gold-400">Home</button>
            <button onClick={() => scrollTo('menu')} className="text-left text-lg font-medium hover:text-gold-400">Menu</button>
            <button onClick={() => scrollTo('rooftop')} className="text-left text-lg font-medium hover:text-gold-400">Rooftop & Events</button>
            <button onClick={() => scrollTo('booking')} className="text-left text-lg font-medium hover:text-gold-400">Bookings</button>
            
            {preOrderItems.length > 0 && (
              <button 
                onClick={() => scrollTo('booking')} 
                className="w-full py-3 bg-coffee-900/60 border border-gold-500/20 text-gold-400 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold"
              >
                <ShoppingCart className="w-4 h-4" /> Selected Pre-orders ({preOrderItems.length})
              </button>
            )}

            <button 
              onClick={() => scrollTo('booking')}
              className="w-full py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 text-coffee-950 rounded-xl text-center font-bold text-sm"
            >
              Reserve Table
            </button>
          </div>
        )}
      </header>

      {/* Main Landing Sections */}
      <main className="relative">
        <HeroSection />
        
        {/* Decorative divider */}
        <div className="relative z-20 h-24 bg-gradient-to-b from-transparent to-coffee-950/45 -mt-24 pointer-events-none" />

        {/* Client-Facing Sections */}
        <MenuSection 
          preOrderItems={preOrderItems} 
          onTogglePreOrder={handleTogglePreOrder} 
        />
        <RooftopEvents />
        <TableBooking 
          preOrderItems={preOrderItems} 
          onRemovePreOrder={handleRemovePreOrder}
          onClearPreOrder={handleClearPreOrder}
        />
      </main>

      {/* Footer */}
      <footer className="relative z-20 bg-black py-16 border-t border-coffee-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-coffee-300">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/assets/logo.jpg" 
                alt="Mana Katha Logo" 
                className="w-10 h-10 object-cover rounded-full border border-gold-500/20 shadow-md shadow-gold-500/5"
              />
              <span className="font-serif font-bold text-white tracking-widest">MANA KATHA</span>
            </div>
            <p className="leading-relaxed text-xs">
              Crafting premium coffee experiences and memories. An escape designed with warmth, elegance, and beautiful skyline views.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-serif font-semibold text-white uppercase tracking-widest text-xs mb-4">Location & Hours</h4>
            <p className="leading-relaxed text-xs mb-2 max-w-xs">5th & 6th floor, BNR Tower, Panama Godowns, H.no:5-581/1A, Plot no 38&39, above Mithaiwala, Vanasthalipuram, Telangana 500070</p>
            <p className="leading-relaxed text-xs mb-2 text-coffee-300 font-medium">Phone: <a href="tel:08883031111" className="hover:text-gold-400 transition-all text-gold-400">088830 31111</a></p>
            <p className="leading-relaxed text-xs text-gold-400 font-semibold mt-1">Open Daily: 9:00 AM - 11:30 PM</p>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-serif font-semibold text-white uppercase tracking-widest text-xs mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-gold-400 transition-all">Home</button></li>
              <li><button onClick={() => scrollTo('menu')} className="hover:text-gold-400 transition-all">Menu</button></li>
              <li><button onClick={() => scrollTo('rooftop')} className="hover:text-gold-400 transition-all">Rooftop Ambience</button></li>
              <li><button onClick={() => scrollTo('booking')} className="hover:text-gold-400 transition-all">Table Reservations</button></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-white uppercase tracking-widest text-xs mb-4">Administrative</h4>
            <button 
              onClick={() => { setView('admin-login'); window.scrollTo({ top: 0 }); }}
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-gold-400 hover:text-gold-300 border border-gold-500/20 px-4 py-2.5 rounded-full bg-coffee-950/40 hover:bg-coffee-950 transition-all"
            >
              <Lock className="w-3.5 h-3.5" /> Owner Portal
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-coffee-900/35 text-center text-xs text-coffee-400">
          <p>© {new Date().getFullYear()} Mana Katha. All rights reserved. Designed with visual excellence.</p>
        </div>
      </footer>

      {/* Floating Back To Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-40 p-3 bg-gold-500 hover:bg-gold-400 text-coffee-950 rounded-full shadow-lg hover:scale-105 transition-all duration-300 border border-gold-400/25"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
}
