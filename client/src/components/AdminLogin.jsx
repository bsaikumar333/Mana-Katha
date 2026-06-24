import React, { useState } from 'react';
import { ShieldAlert, User, KeyRound, ArrowRight, Home } from 'lucide-react';
import API_BASE_URL from '../apiConfig';

export default function AdminLogin({ onLoginSuccess, onGoHome }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      // Successful login
      localStorage.setItem('manakatha_token', data.token);
      localStorage.setItem('manakatha_user', JSON.stringify(data.user));
      onLoginSuccess(data.token, data.user);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-900/40 rounded-full bg-circle-glow animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-gold-950/20 rounded-full bg-circle-glow" />

      {/* Main Container */}
      <div className="w-full max-w-md relative z-10">
        
        {/* Go back trigger */}
        <button 
          onClick={onGoHome}
          className="mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-coffee-300 hover:text-gold-400 transition-all"
        >
          <Home className="w-4 h-4" /> Back to Website
        </button>

        <div className="glass rounded-3xl p-8 md:p-10 shadow-2xl relative">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gold-500/10 border border-gold-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gold-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-white mb-2">Owner Portal</h2>
            <p className="text-xs text-coffee-300 uppercase tracking-widest font-medium">Mana Katha Administration</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-4 bg-red-950/50 border border-red-500/30 text-red-400 text-xs rounded-xl text-center font-medium animate-fade-in">
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-coffee-300 mb-2 font-medium">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500/60" />
                <input
                  type="text"
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-coffee-900/60 border border-coffee-800 rounded-xl text-white focus:outline-none focus:border-gold-500 text-sm font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-coffee-300 mb-2 font-medium">Password</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500/60" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-coffee-900/60 border border-coffee-800 rounded-xl text-white focus:outline-none focus:border-gold-500 text-sm font-medium"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 text-coffee-950 font-bold uppercase tracking-wider hover:from-gold-400 hover:to-gold-500 transition-all duration-300 flex items-center justify-center gap-2 text-xs shadow-lg shadow-gold-500/10"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-coffee-950 border-t-transparent" />
              ) : (
                <>
                  Authenticate <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <p className="text-[10px] text-coffee-400 text-center mt-6">
            Authorized access only. All actions are logged. Default credentials are <b>admin / manakatha123</b>.
          </p>
        </div>
      </div>
    </div>
  );
}
