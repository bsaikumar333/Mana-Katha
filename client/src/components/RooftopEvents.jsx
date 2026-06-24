import React, { useState } from 'react';
import { Calendar, Users, Music, Heart, ArrowRight } from 'lucide-react';

export default function RooftopEvents() {
  const [activeTab, setActiveTab] = useState(0);

  const eventTypes = [
    {
      title: 'Candlelight Dinner',
      description: 'A romantic private setup under the stars, complete with premium floral styling, a personalized menu, and intimate ambient lighting.',
      icon: Heart,
      badge: 'Perfect for Couples'
    },
    {
      title: 'Social Gatherings',
      description: 'Host unforgettable birthdays, anniversaries, or corporate team dinners. Our modular setups accommodate up to 50 guests comfortably.',
      icon: Users,
      badge: 'Up to 50 guests'
    },
    {
      title: 'Acoustic & Art Evenings',
      description: 'Experience live acoustic sessions, poetry sessions, and coffee tasting workshops scheduled weekly against the twilight city backdrop.',
      icon: Music,
      badge: 'Weekly Events'
    }
  ];

  return (
    <section id="rooftop" className="relative z-20 py-24 bg-gradient-to-b from-[#0a1128]/50 to-[#020617]/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Text Description Content (Left Column) */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <span className="text-gold-400 text-sm font-semibold uppercase tracking-[0.2em] mb-3 block">
              Elevated Ambience
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-white font-bold leading-tight mb-6">
              Rooftop Dining & Private Gatherings
            </h2>
            <div className="w-16 h-1 bg-gold-500 mb-8" />
            
            <p className="text-coffee-200 leading-relaxed mb-8 font-light">
              Perched above the city noise, the Mana Katha Rooftop blends warm fairy lights, lush natural greenery, and sleek modern woodwork. It provides a dreamy, intimate backdrop for your special events or a quiet evening espresso.
            </p>

            {/* Event Tabs / Features */}
            <div className="space-y-4 mb-8">
              {eventTypes.map((event, idx) => {
                const Icon = event.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTab(idx)}
                    className={`w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-start gap-4 ${
                      activeTab === idx
                        ? 'bg-coffee-900/60 border-gold-500/50 shadow-md shadow-gold-500/5'
                        : 'bg-transparent border-coffee-900 hover:border-coffee-800'
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg ${activeTab === idx ? 'bg-gold-500 text-coffee-950' : 'bg-coffee-900 text-gold-400'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-sans font-semibold text-white text-base">{event.title}</h4>
                        <span className="text-[10px] bg-coffee-800 text-gold-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-medium">
                          {event.badge}
                        </span>
                      </div>
                      {activeTab === idx && (
                        <p className="text-coffee-300 text-sm mt-2 leading-relaxed animate-fade-in">
                          {event.description}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <a 
              href="#booking"
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-semibold tracking-wide transition-all group"
            >
              Book Your Custom Event <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Visual Showcase (Right Column) */}
          <div className="lg:col-span-7 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-gold-500/20 group">
              {/* Premium Background image */}
              <img 
                src="/assets/rooftop_events.png" 
                alt="Mana Katha Rooftop Ambience" 
                className="w-full h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              
              {/* Floating Ambience Tags */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="glass-light backdrop-blur-md px-5 py-3.5 rounded-xl border border-white/10 text-white">
                  <p className="text-xs uppercase tracking-widest text-gold-300 font-medium mb-0.5">Operating Hours</p>
                  <p className="text-sm font-semibold">4:00 PM - 11:30 PM</p>
                </div>
                <div className="glass-light backdrop-blur-md px-5 py-3.5 rounded-xl border border-white/10 text-white text-right">
                  <p className="text-xs uppercase tracking-widest text-gold-300 font-medium mb-0.5">Seating Ambience</p>
                  <p className="text-sm font-semibold">Open Air Skyline</p>
                </div>
              </div>
            </div>

            {/* Decorative Background Frame */}
            <div className="absolute -top-4 -left-4 w-full h-full border border-gold-500/10 rounded-2xl -z-10 translate-x-1 translate-y-1" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold-500/5 rounded-full blur-2xl -z-10" />
          </div>

        </div>

      </div>
    </section>
  );
}
