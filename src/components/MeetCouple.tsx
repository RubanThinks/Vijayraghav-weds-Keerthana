import React, { useState, useEffect } from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { MonogramVK } from './MonogramVK';

export const MeetCouple: React.FC = () => {
  const { couple } = weddingData;
  const { groom, bride } = couple;
  const [isDesktop, setIsDesktop] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="couple" className="screen-section relative overflow-hidden bg-wine-950 flex items-center justify-center select-none">
      {/* 100% Full Viewport on Mobile (Zero Gaps), 16:9 on Desktop */}
      <div className="relative w-full h-[100dvh] min-h-[100dvh] md:min-h-0 md:h-[min(100dvh,calc(100vw*9/16))] md:w-[min(100vw,calc(100dvh*16/9))] md:aspect-[16/9] flex items-center justify-center overflow-hidden select-none shadow-2xl">
        
        {/* Exact Uploaded Images (Mobile & Desktop) - Raw & Unblurred */}
        <picture className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
          <source media="(max-width: 767px)" srcSet="/assets/backgrounds/couple-mobile.jpg" />
          <img
            src="/assets/backgrounds/couple-desktop.jpg"
            alt="Couple Pavilion Background"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </picture>

        {/* Central Composition framed by the Golden Arch above the podium */}
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center justify-between h-full pt-16 pb-6 sm:pt-20 sm:pb-8 md:pt-6 md:pb-6 px-4">
          
          {/* Top Section Header with Monogram - Shifted Down South into the Open Golden Arch */}
          <div className="flex flex-col items-center mt-1 sm:mt-2">
            <MonogramVK size={isDesktop ? 48 : 36} className="mb-1" />
            <div className="flex items-center gap-2">
              <span className="h-px w-8 sm:w-14 bg-gradient-to-r from-transparent to-gold-400" />
              <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.35em] uppercase text-gold-300 font-semibold text-shadow-deep">
                The Blessed Union
              </span>
              <span className="h-px w-8 sm:w-14 bg-gradient-to-l from-transparent to-gold-400" />
            </div>

            <h2 className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-ivory-50 tracking-wide mt-1 text-shadow-deep">
              Two Hearts, One Sacred Journey
            </h2>
          </div>

          {/* Center Couple Showcase - Positioned Above the Stage Podium */}
          <div className="w-full max-w-2xl flex flex-col items-center my-auto">
            
            {/* Couple Side-by-Side Cards / Medallions */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6 w-full items-center">
              
              {/* GROOM: Vijayraghav */}
              <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-plum-950/85 border border-gold-400/40 shadow-xl group hover:border-gold-400 transition-all">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-gold-400 shadow-md bg-wine-900 mb-2">
                  <img
                    src={groom.photo}
                    alt={groom.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 rounded-full border border-gold-200/40 pointer-events-none" />
                </div>

                <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-gold-300 font-semibold">
                  The Groom
                </span>

                <h3 className="font-calligraphy text-2xl sm:text-3xl md:text-4xl text-gold-gradient py-0.5 leading-tight">
                  {groom.name}
                </h3>

                <p className="font-serif italic text-[11px] sm:text-xs text-ivory-100/90 leading-tight mt-1 line-clamp-2">
                  "{groom.quote}"
                </p>
              </div>

              {/* BRIDE: Keerthana */}
              <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-plum-950/85 border border-gold-400/40 shadow-xl group hover:border-gold-400 transition-all">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-gold-400 shadow-md bg-wine-900 mb-2">
                  <img
                    src={bride.photo}
                    alt={bride.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 rounded-full border border-gold-200/40 pointer-events-none" />
                </div>

                <span className="font-sans text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-gold-300 font-semibold">
                  The Bride
                </span>

                <h3 className="font-calligraphy text-2xl sm:text-3xl md:text-4xl text-gold-gradient py-0.5 leading-tight">
                  {bride.name}
                </h3>

                <p className="font-serif italic text-[11px] sm:text-xs text-ivory-100/90 leading-tight mt-1 line-clamp-2">
                  "{bride.quote}"
                </p>
              </div>
            </div>

            {/* Romantic Introduction Quote */}
            <div className="mt-3 sm:mt-4 px-4 py-2 rounded-full bg-plum-950/85 border border-gold-400/30 flex items-center gap-2 shadow-lg">
              <Heart className="w-3.5 h-3.5 text-gold-400 fill-gold-400/30 shrink-0" />
              <p className="font-serif italic text-xs sm:text-sm text-ivory-100 font-normal">
                "Blessed by family grace, stepping into forever together in divine harmony."
              </p>
              <Sparkles className="w-3.5 h-3.5 text-gold-400 shrink-0" />
            </div>
          </div>

          {/* Bottom Podium Tag */}
          <div className="mb-2 sm:mb-4">
            <span className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-gold-300/90 font-medium text-shadow-deep">
              #VijayraghavWedsKeerthana
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
