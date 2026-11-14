import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { RawBackground } from './RawBackground';

export const DivineHero: React.FC = () => {
  const { blessings } = weddingData;
  const [rotateInteractive, setRotateInteractive] = useState<number>(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    setRotateInteractive((x / (rect.width / 2)) * 6);
  };

  const handleMouseLeave = () => {
    setRotateInteractive(0);
  };

  return (
    <section id="hero" className="screen-section relative overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Plain, Raw, Unblurred 16:9 Desktop & 9:16 Mobile Background */}
      <RawBackground />

      {/* Hero Content Container - Centered and Fitted within Screen Boundaries */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center justify-center py-4 sm:py-6 h-full max-h-[100dvh] gap-1.5 sm:gap-2.5 overflow-visible">
        
        {/* Invocation Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-gold-400" />
          <span className="font-cinzel text-[11px] sm:text-xs md:text-sm tracking-[0.35em] uppercase text-gold-300 font-semibold flex items-center gap-1.5 text-shadow-deep">
            <Sparkles className="w-3.5 h-3.5 text-gold-400 inline" />
            {blessings.motto}
          </span>
          <span className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-gold-400" />
        </div>

        {/* Lord Murugan Portrait */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative my-0.5 sm:my-1 flex items-center justify-center cursor-pointer select-none"
        >
          <div
            className="relative z-10 w-36 sm:w-44 md:w-52 lg:w-56 max-h-[22vh] sm:max-h-[25vh] md:max-h-[27vh] transition-transform duration-500 ease-out flex items-center justify-center"
            style={{
              transform: `perspective(1000px) rotateY(${rotateInteractive}deg) translateY(-2px)`,
            }}
          >
            <img
              src="/assets/deity/lord-murugan.png"
              alt="Lord Murugan with Divine Golden Vel and Peacock"
              className="max-h-[22vh] sm:max-h-[25vh] md:max-h-[27vh] w-auto object-contain drop-shadow-[0_16px_36px_rgba(0,0,0,0.95)] filter brightness-105"
              loading="eager"
            />
          </div>
        </div>

        {/* Couple Names - Grand Luxury Calligraphy with 'weds' */}
        <div className="py-0.5 sm:py-1 overflow-visible">
          <div className="overflow-visible">
            <h1 className="font-calligraphy text-7xl sm:text-8xl md:text-9xl lg:text-[6.5rem] xl:text-[7.2rem] text-gold-gradient tracking-wide drop-shadow-[0_4px_28px_rgba(0,0,0,0.98)] leading-[0.92] overflow-visible">
              Vijayraghav
            </h1>
          </div>

          <div className="flex items-center justify-center gap-3 my-0.5 sm:my-1">
            <span className="h-px w-10 sm:w-20 bg-gradient-to-r from-transparent to-gold-400" />
            <span className="font-serif italic text-2xl sm:text-3xl md:text-4xl text-gold-200 text-shadow-deep tracking-widest">
              weds
            </span>
            <span className="h-px w-10 sm:w-20 bg-gradient-to-l from-transparent to-gold-400" />
          </div>

          <div className="overflow-visible">
            <h1 className="font-calligraphy text-7xl sm:text-8xl md:text-9xl lg:text-[6.5rem] xl:text-[7.2rem] text-gold-gradient tracking-wide drop-shadow-[0_4px_28px_rgba(0,0,0,0.98)] leading-[0.92] overflow-visible">
              Keerthana
            </h1>
          </div>
        </div>

        {/* Invitation Message Below Names - Prominently sized & visible */}
        <p className="max-w-2xl font-serif italic text-sm sm:text-base md:text-lg lg:text-xl text-ivory-100/95 leading-relaxed mt-2 sm:mt-3 text-shadow-deep font-normal px-6">
          "{blessings.invitationNote}"
        </p>
      </div>
    </section>
  );
};
