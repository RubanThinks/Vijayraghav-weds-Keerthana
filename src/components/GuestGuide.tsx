import React from 'react';
import { Plane, Train, Hotel, Sparkles } from 'lucide-react';
import { RawBackground } from './RawBackground';

export const GuestGuide: React.FC = () => {
  const travelOptions = [
    {
      title: "By Air",
      icon: Plane,
      badge: "TRZ & CJB Airports",
      desc: "Tiruchirappalli (TRZ ~80 km) and Coimbatore (CJB ~130 km) airports offer frequent direct taxis and transfers to Karur.",
    },
    {
      title: "By Train",
      icon: Train,
      badge: "Karur Junction (KRR)",
      desc: "Direct express trains from Chennai, Bengaluru, and Coimbatore. The venue is just 10 minutes from the station.",
    },
    {
      title: "Guest Stays",
      icon: Hotel,
      badge: "Karur Town",
      desc: "Comfortable air-conditioned hotel rooms, suites, and guest accommodations are located within 3 km of the Mahal.",
    },
  ];

  return (
    <section id="guest-guide" className="screen-section px-4 sm:px-6 lg:px-8">
      {/* Plain, Raw, Unblurred 16:9 Desktop & 9:16 Mobile Background */}
      <RawBackground />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center py-10 sm:py-8 w-full">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-cinzel text-[11px] sm:text-xs tracking-[0.35em] uppercase text-gold-300 font-semibold text-shadow-deep">
              Guest Concierge
            </span>
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          </div>

          <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-ivory-50 tracking-wide text-shadow-deep">
            Travel &amp; Guest Guide
          </h2>
          <p className="font-sans text-[11px] sm:text-xs text-gold-300/90 tracking-widest uppercase mt-1 text-shadow-deep">
            Directions and travel routes to Karur
          </p>
        </div>

        {/* Square Travel Cards Grid: Desktop & Mobile View */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6 w-full max-w-4xl mx-auto items-center justify-center">
          {travelOptions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="w-full max-w-[280px] sm:max-w-none mx-auto aspect-square p-6 sm:p-7 rounded-3xl luxury-card-gold shadow-[0_12px_36px_rgba(0,0,0,0.7)] border border-gold-400/50 flex flex-col items-center justify-center text-center group hover:border-gold-300 transition-all duration-300 hover:scale-[1.02]"
              >
                {/* Large Icon Container */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-gold-500/25 to-wine-900/80 border border-gold-400/50 flex items-center justify-center text-gold-300 mb-3 shadow-lg group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-gold-300 drop-shadow-md" />
                </div>

                {/* Badge */}
                <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-wider text-gold-300 font-semibold bg-wine-950/90 px-3 py-1 rounded-full border border-gold-400/30 mb-2 shadow-sm">
                  {item.badge}
                </span>

                {/* Title */}
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-gold-gradient tracking-wide mb-1.5">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="font-sans text-[11px] sm:text-xs text-ivory-100/85 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GuestGuide;
