import React, { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { MonogramVK } from './MonogramVK';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

export const WeddingCountdown: React.FC = () => {
  const { countdown } = weddingData;
  const [isDesktop, setIsDesktop] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const calculateTimeLeft = (): TimeLeft => {
    // 13 December 2026 04:30:00 IST (+05:30)
    const target = new Date(countdown.targetIsoDate).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isComplete: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { days, hours, minutes, seconds, isComplete: false };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <section id="countdown" className="screen-section relative overflow-hidden bg-wine-950 flex items-center justify-center select-none">
      {/* 100% Full Viewport on Mobile (Zero Gaps), 16:9 on Desktop */}
      <div className="relative w-full h-[100dvh] min-h-[100dvh] md:min-h-0 md:h-[min(100dvh,calc(100vw*9/16))] md:w-[min(100vw,calc(100dvh*16/9))] md:aspect-[16/9] flex items-center justify-center overflow-hidden select-none shadow-2xl">
        
        {/* Exact Uploaded Countdown Images (Mobile & Desktop) - Hourglass & Lanterns Preserved */}
        <picture className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
          <source media="(max-width: 767px)" srcSet="/assets/backgrounds/countdown-mobile.jpg" />
          <img
            src="/assets/backgrounds/countdown-desktop.jpg"
            alt="Wedding Countdown Hourglass Background"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </picture>

        {/* Content Layer: Positioned Down in the Clear Central Velvet Zone Above the Golden Hourglass */}
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center justify-center h-full pt-28 pb-20 sm:pt-32 sm:pb-24 md:pt-10 md:pb-6 px-4">
          
          {/* Header */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-0.5">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.35em] uppercase text-gold-300 font-semibold text-shadow-deep">
                Every Second Closer
              </span>
              <Clock className="w-3.5 h-3.5 text-gold-400" />
            </div>

            <h2 className="font-serif italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-ivory-50 tracking-wide mt-0.5 text-shadow-deep">
              Counting Down to Forever
            </h2>

            <p className="font-sans text-[10px] sm:text-xs text-gold-300/90 tracking-widest uppercase mt-1 text-shadow-deep">
              13 December 2026 • 4:30 AM IST • Shri Kamatchi Mahal, Karur
            </p>
          </div>

          {/* Auspicious Muhurtham Pill */}
          <div className="mt-2 sm:mt-3 px-3.5 py-1 rounded-full bg-plum-950/85 border border-gold-400/40 flex items-center gap-1.5 text-gold-200 text-[11px] sm:text-xs font-serif italic shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>சுப முகூர்த்தம் — பிரம்ம முகூர்த்த வேளை (Brahma Muhurtham)</span>
          </div>

          {/* Countdown Display: Translucent Plum Glass Panels with Champagne-Gold Borders */}
          {timeLeft.isComplete ? (
            <div className="mt-4 sm:mt-6 p-5 sm:p-6 rounded-3xl bg-plum-950/85 border border-gold-400/50 text-center max-w-md shadow-2xl animate-fadeIn">
              <MonogramVK size={isDesktop ? 48 : 36} className="mb-2" />
              <h3 className="font-calligraphy text-3xl sm:text-4xl text-gold-gradient">
                The Celebration Has Begun!
              </h3>
              <p className="font-serif text-sm text-ivory-100 mt-2">
                Vijayraghav &amp; Keerthana are united in sacred matrimony.
              </p>
            </div>
          ) : (
            <div className="mt-3 sm:mt-5 grid grid-cols-4 gap-2 sm:gap-4 max-w-xl w-full">
              {timeUnits.map((unit) => (
                <div
                  key={unit.label}
                  className="relative group flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-2xl bg-plum-950/80 border border-gold-400/40 shadow-xl backdrop-blur-none hover:border-gold-400 transition-all duration-300"
                >
                  <span className="font-cinzel font-bold text-3xl sm:text-4xl md:text-5xl text-gold-gradient tracking-tight drop-shadow-md">
                    {String(unit.value).padStart(2, '0')}
                  </span>
                  <span className="font-sans text-[9px] sm:text-[10px] md:text-xs uppercase tracking-[0.2em] text-gold-300/85 font-semibold mt-1">
                    {unit.label}
                  </span>
                  <div className="w-6 h-0.5 bg-gradient-to-r from-transparent via-gold-400/50 to-transparent mt-1" />
                </div>
              ))}
            </div>
          )}

          {/* Subtle Indicator above the Hourglass base */}
          <div className="mt-3 sm:mt-4 text-[10px] font-sans tracking-[0.2em] text-gold-300/70 uppercase">
            Time Flows Into Eternity
          </div>
        </div>
      </div>
    </section>
  );
};
