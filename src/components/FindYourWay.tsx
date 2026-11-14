import React, { useState } from 'react';
import { MapPin, Navigation as NavIcon, ExternalLink, CheckCircle2, Compass, Copy, Check } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { RawBackground } from './RawBackground';

export const FindYourWay: React.FC = () => {
  const { venue } = weddingData;
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopyAddress = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(venue.fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const directMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.mapQuery)}`;
  const directDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venue.mapQuery)}`;

  return (
    <section id="venue" className="screen-section px-4 sm:px-6 lg:px-8">
      {/* Plain, Raw, Unblurred 16:9 Desktop & 9:16 Mobile Background */}
      <RawBackground />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center py-8 sm:py-6 w-full">
        {/* Section Header */}
        <div className="text-center mb-3 sm:mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Compass className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-cinzel text-[11px] sm:text-xs tracking-[0.35em] uppercase text-gold-300 font-semibold text-shadow-deep">
              Venue &amp; Location
            </span>
            <Compass className="w-3.5 h-3.5 text-gold-400" />
          </div>

          <h2 className="font-serif italic text-2xl sm:text-4xl md:text-5xl text-ivory-50 tracking-wide text-shadow-deep">
            Find Your Way
          </h2>
          <p className="font-sans text-[10px] sm:text-xs text-gold-300/90 tracking-widest uppercase mt-0.5 text-shadow-deep">
            Shri Kamatchi Mahal • Karur, Tamil Nadu
          </p>
        </div>

        {/* Venue Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-5 items-stretch w-full">
          {/* Left Column: Venue Info */}
          <div className="md:col-span-5 flex flex-col justify-between p-4 sm:p-5 rounded-3xl luxury-card shadow-2xl">
            <div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/35 text-emerald-300 text-[10px] font-sans font-medium w-fit mb-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>Single Venue for Reception &amp; Muhurtham</span>
              </div>

              <h3 className="font-cinzel font-bold text-xl sm:text-2xl text-gold-gradient tracking-wide">
                {venue.name}
              </h3>
              <p className="font-serif italic text-xs sm:text-sm text-ivory-100/90 mt-1 leading-relaxed">
                {venue.fullAddress}
              </p>

              <div className="mt-3 space-y-1.5">
                {venue.features.slice(0, 4).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] font-sans text-ivory-200/90">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="mt-4 pt-3 border-t border-gold-500/20 flex flex-wrap items-center gap-2">
              <a
                href={directDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[120px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-plum-950 font-sans text-xs font-bold tracking-wider uppercase transition-all shadow-md active:scale-95"
              >
                <NavIcon className="w-3.5 h-3.5 text-plum-950" />
                <span>Get Directions</span>
              </a>

              <a
                href={directMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-full bg-wine-900/90 hover:bg-wine-850 text-gold-200 border border-gold-500/40 font-sans text-xs font-semibold tracking-wider uppercase transition-all hover:scale-105 active:scale-95"
              >
                <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
                <span>Open Maps</span>
              </a>

              <button
                onClick={handleCopyAddress}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-full bg-wine-950/90 hover:bg-wine-900 text-gold-300/90 border border-gold-500/30 font-sans text-xs font-medium tracking-wider uppercase transition-all hover:text-gold-100"
                title="Copy Address to Clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gold-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Google Maps Embed with Overlay Link */}
          <div className="md:col-span-7 rounded-3xl overflow-hidden luxury-card-gold shadow-2xl relative h-[250px] sm:h-[320px] md:h-auto min-h-[240px]">
            <iframe
              title="Shri Kamatchi Mahal Google Maps Location"
              src="https://maps.google.com/maps?q=Shri+Kamatchi+Mahal,+Karur,+Tamil+Nadu&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            />
            {/* Interactive Location Badge */}
            <a
              href={directDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-2.5 left-2.5 bg-wine-950/95 hover:bg-wine-900 px-3 py-1.5 rounded-full border border-gold-400/50 flex items-center gap-1.5 text-[11px] font-sans text-gold-200 shadow-xl transition-all hover:scale-105"
            >
              <MapPin className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-medium">Shri Kamatchi Mahal • Tap for GPS</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

