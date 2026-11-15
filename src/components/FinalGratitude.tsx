import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { MonogramVK } from './MonogramVK';

export const FinalGratitude: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="gratitude" className="screen-section relative overflow-hidden bg-wine-950 flex items-center justify-center select-none">
      {/* 100% Full Viewport on Mobile (Zero Gaps), 16:9 on Desktop */}
      <div className="relative w-full h-[100dvh] min-h-[100dvh] md:min-h-0 md:h-[min(100dvh,calc(100vw*9/16))] md:w-[min(100vw,calc(100dvh*16/9))] md:aspect-[16/9] flex items-center justify-center overflow-hidden select-none shadow-2xl">
        
        {/* Dedicated Gratitude Background Artwork (Hanging Vilakku Lamps & Royal Plum Velvet) */}
        <picture className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
          <source media="(max-width: 767px)" srcSet="/assets/backgrounds/gratitude-mobile.jpg" />
          <img
            src="/assets/backgrounds/gratitude-desktop.jpg"
            alt="Gratitude Traditional Vilakku & Floral Background"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </picture>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center justify-between h-full pt-16 pb-8 sm:pt-20 sm:pb-10 md:pt-10 md:pb-8 px-6">
          
          {/* Header Monogram */}
          <div className="flex flex-col items-center mt-2 sm:mt-4">
            <MonogramVK size={isDesktop ? 56 : 44} className="mb-2" />
            <div className="flex items-center gap-2">
              <span className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-gold-400" />
              <span className="font-cinzel text-[11px] sm:text-xs tracking-[0.35em] uppercase text-gold-300 font-semibold text-shadow-deep">
                With Sincere Gratitude
              </span>
              <span className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-gold-400" />
            </div>
          </div>

          {/* Central Emotional Message */}
          <div className="w-full max-w-xl flex flex-col items-center my-auto px-4">
            
            {/* User-Specified Quote */}
            <p className="font-serif italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-ivory-50 max-w-lg leading-relaxed text-shadow-deep font-normal">
              "Your presence will make our celebration even more special."
            </p>

            {/* Antique Champagne Gold Separator */}
            <div className="flex items-center justify-center gap-2 my-3 sm:my-4 w-44 sm:w-60">
              <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
              <Heart className="w-4 h-4 text-gold-400 fill-gold-400/40" />
              <span className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-gold-400 to-transparent" />
            </div>

            {/* Signature intro */}
            <span className="font-serif italic text-base sm:text-lg text-gold-200/90 tracking-wide">
              With love &amp; respect,
            </span>

            {/* Grand Calligraphy Couple Names */}
            <h2 className="font-calligraphy text-5xl sm:text-6xl md:text-7xl text-gold-gradient py-1 leading-tight drop-shadow-2xl">
              Vijayraghav &amp; Keerthana
            </h2>

            {/* Welcoming Note */}
            <div className="mt-3 px-5 py-2.5 rounded-full bg-plum-950/85 border border-gold-400/35 flex items-center gap-2 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
              <p className="font-serif italic text-xs sm:text-sm text-ivory-100">
                Awaiting the joy of celebrating this divine milestone together with you.
              </p>
              <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
            </div>
          </div>

          {/* Footer Note */}
          <div className="mb-2 text-[10px] sm:text-[11px] font-sans tracking-[0.25em] text-gold-300/80 uppercase text-shadow-deep">
            Shri Kamatchi Mahal • Karur, Tamil Nadu • 2026
          </div>
        </div>
      </div>
    </section>
  );
};
