import React, { useState, useEffect } from 'react';
import { ChevronDown, Coffee } from 'lucide-react';

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate parallax styles
  const windowHeight = window.innerHeight || 800;
  const opacity = Math.max(0, 1 - scrollY / (windowHeight * 0.8));
  const scale = Math.max(0.85, 1 - scrollY / (windowHeight * 4));
  const translateY = scrollY * 0.3; // Parallax translation

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-coffee-800 rounded-full bg-circle-glow animate-pulse duration-10000" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold-900 rounded-full bg-circle-glow" />

      {/* Fixed Parallax Container */}
      <div 
        className="fixed inset-0 w-full h-screen flex flex-col items-center justify-center z-10 px-4 select-none"
        style={{
          opacity: opacity,
          transform: `scale(${scale}) translateY(${translateY}px)`,
          pointerEvents: opacity < 0.1 ? 'none' : 'auto'
        }}
      >
        {/* Coffee Dispenser Premium Image */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src="/assets/coffee_dispenser.png" 
            alt="Mana Katha Espresso Dispenser" 
            className="w-full h-full object-cover opacity-45 mix-blend-lighten"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-coffee-950 via-transparent to-black opacity-80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center max-w-4xl mx-auto flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-gold-500/30 bg-coffee-950/80 backdrop-blur-md animate-fade-in">
            <Coffee className="w-4 h-4 text-gold-400" />
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-gold-300">
              Welcome to Mana Katha
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-serif text-white font-bold leading-tight tracking-wide mb-6 drop-shadow-2xl">
            Sip the <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-coffee-400">Story</span>,
            <br />
            Savor the <span className="font-serif italic text-gold-300">Soul</span>
          </h1>

          <p className="text-base md:text-xl text-coffee-200 max-w-2xl mx-auto leading-relaxed mb-10 font-light px-4">
            An artisanal boutique cafe & scenic rooftop lounge. We blend gourmet hand-pulled espresso with local heritage ingredients in every cup.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="#menu" 
              className="px-8 py-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 text-coffee-950 font-semibold tracking-wider hover:from-gold-400 hover:to-gold-500 shadow-lg shadow-gold-500/20 transition-all duration-300 hover:scale-105"
            >
              Explore Our Menu
            </a>
            <a 
              href="#booking" 
              className="px-8 py-4 rounded-full border border-gold-500/40 text-gold-400 font-semibold tracking-wider hover:bg-gold-500/10 hover:text-white transition-all duration-300 backdrop-blur-sm"
            >
              Reserve a Table
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-coffee-300/60 animate-bounce duration-2000">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll to Discover</span>
          <ChevronDown className="w-5 h-5 text-gold-400" />
        </div>
      </div>

      {/* Spacer to push content down and let hero scroll out */}
      <div className="w-full h-screen pointer-events-none" />
    </div>
  );
}
