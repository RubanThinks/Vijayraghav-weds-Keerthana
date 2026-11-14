import React from 'react';
import { Plane, Train, Hotel, Sparkles, Car, Utensils, CheckCircle2 } from 'lucide-react';
import { RawBackground } from './RawBackground';

export const GuestGuide: React.FC = () => {
  const travelOptions = [
    {
      title: "By Air",
      icon: Plane,
      badge: "TRZ & CJB",
      desc: "Tiruchirappalli (TRZ ~80 km) & Coimbatore (CJB ~130 km) airports offer frequent taxis directly to Karur.",
    },
    {
      title: "By Train",
      icon: Train,
      badge: "Karur Junction (KRR)",
      desc: "Prime railway junction directly connected to Chennai, Bangalore, and Coimbatore. Just 10 mins to the venue.",
    },
    {
      title: "Guest Stays",
      icon: Hotel,
      badge: "Karur Town",
      desc: "Comfortable air-conditioned hotel rooms and premium guest stays are available within 3 km of the venue.",
    },
  ];

  const hospitalityFeatures = [
    {
      icon: CheckCircle2,
      title: "Same Venue for All Celebrations",
      desc: "Both the Grand Reception (12 Dec) and Sacred Muhurtham (13 Dec) will be held at Shri Kamatchi Mahal, Karur.",
    },
    {
      icon: Car,
      title: "Valet & Dedicated Parking",
      desc: "Spacious and secure parking facilities are arranged within the venue premises for all guests.",
    },
    {
      icon: Utensils,
      title: "Traditional South Indian Dining",
      desc: "Authentic, grand vegetarian feast prepared with love and served in the air-conditioned dining hall.",
    },
  ];

  return (
    <section id="guest-guide" className="screen-section px-4 sm:px-6 lg:px-8">
      {/* Plain, Raw, Unblurred 16:9 Desktop & 9:16 Mobile Background */}
      <RawBackground />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center py-8 sm:py-6 w-full">
        {/* Section Header */}
        <div className="text-center mb-3 sm:mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-cinzel text-[11px] sm:text-xs tracking-[0.35em] uppercase text-gold-300 font-semibold text-shadow-deep">
              Guest Concierge
            </span>
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          </div>

          <h2 className="font-serif italic text-2xl sm:text-4xl md:text-5xl text-ivory-50 tracking-wide text-shadow-deep">
            Travel &amp; Hospitality
          </h2>
          <p className="font-sans text-[10px] sm:text-xs text-gold-300/90 tracking-widest uppercase mt-0.5 text-shadow-deep">
            Everything you need for a comfortable visit to Karur
          </p>
        </div>

        {/* 3 Travel Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-3">
          {travelOptions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-3 sm:p-4 rounded-2xl luxury-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="w-7 h-7 rounded-xl bg-gold-500/20 border border-gold-400/35 flex items-center justify-center text-gold-300">
                      <Icon className="w-3.5 h-3.5 text-gold-400" />
                    </span>
                    <span className="font-sans text-[9px] uppercase tracking-wider text-gold-300/90 bg-wine-900/80 px-2 py-0.5 rounded-full border border-gold-500/20">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-cinzel text-xs sm:text-sm font-bold text-gold-gradient">
                    {item.title}
                  </h3>
                  <p className="font-sans text-[10px] sm:text-[11px] text-ivory-200/90 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hospitality & Comfort Card (Replaced Dress Code) */}
        <div className="p-4 sm:p-5 rounded-2xl luxury-card-gold w-full shadow-xl">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-gold-500/20">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span className="font-cinzel text-xs font-bold text-gold-gradient uppercase tracking-wider">
                Hospitality &amp; Guest Comfort
              </span>
            </div>
            <span className="text-[10px] font-sans text-gold-300/80 uppercase tracking-widest">
              Shri Kamatchi Mahal • Karur
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {hospitalityFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-3 rounded-xl bg-wine-900/60 border border-gold-500/20 flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span className="text-xs font-cinzel font-bold text-gold-200">
                      {item.title}
                    </span>
                  </div>
                  <p className="font-sans text-[10px] sm:text-[11px] text-ivory-100/85 leading-relaxed mt-0.5">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

