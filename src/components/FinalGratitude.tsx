import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Send, Check } from 'lucide-react';
import { MonogramVK } from './MonogramVK';

interface GuestWish {
  id: string;
  name: string;
  message: string;
}

export const FinalGratitude: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [guestName, setGuestName] = useState<string>('');
  const [guestMessage, setGuestMessage] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [wishes, setWishes] = useState<GuestWish[]>([
    {
      id: '1',
      name: 'Ramesh & Family',
      message: 'May Lord Murugan shower Vijayraghav and Keerthana with eternal bliss and prosperity!',
    },
    {
      id: '2',
      name: 'Ananya & Karthik',
      message: 'Heartiest congratulations to the lovely couple! Looking forward to celebrating in Karur.',
    },
  ]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSendWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestMessage.trim()) return;

    const newWish: GuestWish = {
      id: Date.now().toString(),
      name: guestName.trim(),
      message: guestMessage.trim(),
    };

    setWishes([newWish, ...wishes]);
    setGuestName('');
    setGuestMessage('');
    setSubmitted(true);

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#E0B477', '#F7DFB3', '#B17D3E', '#FFFFFF'],
      });
    } catch {
      // Ignore
    }

    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="gratitude" className="screen-section relative overflow-hidden bg-wine-950 flex items-center justify-center select-none">
      {/* 100% Full Viewport on Mobile (Zero Gaps), 16:9 on Desktop */}
      <div className="relative w-full h-[100dvh] min-h-[100dvh] md:min-h-0 md:h-[min(100dvh,calc(100vw*9/16))] md:w-[min(100vw,calc(100dvh*16/9))] md:aspect-[16/9] flex items-center justify-center overflow-hidden select-none shadow-2xl">
        
        {/* Deep Midnight Plum & Creamy Roses Artwork Layer */}
        <picture className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
          <source media="(max-width: 767px)" srcSet="/assets/backgrounds/hero-mobile.jpg" />
          <img
            src="/assets/backgrounds/hero-desktop.jpg"
            alt="Gratitude Botanical Background"
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </picture>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center justify-between h-full py-4 sm:py-6 px-4">
          
          {/* Header Monogram */}
          <div className="flex flex-col items-center mt-1 sm:mt-2">
            <MonogramVK size={isDesktop ? 56 : 42} className="mb-2" />
            <div className="flex items-center gap-2">
              <span className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-gold-400" />
              <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.35em] uppercase text-gold-300 font-semibold text-shadow-deep">
                With Sincere Gratitude
              </span>
              <span className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-gold-400" />
            </div>
          </div>

          {/* Central Emotional Message */}
          <div className="w-full max-w-xl flex flex-col items-center my-auto px-2">
            
            {/* User-Specified Quote */}
            <p className="font-serif italic text-xl sm:text-2xl md:text-3xl lg:text-4xl text-ivory-50 max-w-lg leading-relaxed text-shadow-deep font-normal">
              "Your presence will make our celebration even more special."
            </p>

            {/* Antique Champagne Gold Separator */}
            <div className="flex items-center justify-center gap-2 my-2 sm:my-3 w-40 sm:w-56">
              <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
              <Heart className="w-3.5 h-3.5 text-gold-400 fill-gold-400/40" />
              <span className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-gold-400 to-transparent" />
            </div>

            {/* Signature */}
            <span className="font-serif italic text-sm sm:text-base text-gold-200 tracking-wide">
              With love,
            </span>

            <h2 className="font-calligraphy text-4xl sm:text-5xl md:text-6xl text-gold-gradient py-0.5 leading-tight drop-shadow-xl">
              Vijayraghav &amp; Keerthana
            </h2>

            {/* Guestbook Blessing Card */}
            <div className="mt-3 w-full p-3 sm:p-4 rounded-2xl bg-plum-950/85 border border-gold-400/35 shadow-xl text-left">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-cinzel text-[11px] sm:text-xs text-gold-300 font-semibold tracking-wider uppercase">
                  Send Your Blessings
                </span>
                {submitted && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-gold-200">
                    <Check className="w-3 h-3 text-gold-400" />
                    <span>Blessing Received!</span>
                  </span>
                )}
              </div>

              <form onSubmit={handleSendWish} className="flex flex-col gap-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Your Name / Family"
                    className="flex-1 bg-plum-900/80 border border-gold-500/30 rounded-xl px-2.5 py-1 text-xs text-ivory-100 placeholder:text-gold-300/40 focus:outline-none focus:border-gold-400"
                    maxLength={50}
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 bg-gold-500 hover:bg-gold-400 text-plum-950 font-sans text-xs font-semibold rounded-xl transition-all flex items-center gap-1 shrink-0"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={guestMessage}
                  onChange={(e) => setGuestMessage(e.target.value)}
                  placeholder="Share a heartfelt blessing or wish for the couple..."
                  className="w-full bg-plum-900/80 border border-gold-500/30 rounded-xl px-2.5 py-1 text-xs text-ivory-100 placeholder:text-gold-300/40 focus:outline-none focus:border-gold-400"
                  maxLength={160}
                />
              </form>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mb-2 text-[10px] sm:text-[11px] font-sans tracking-[0.25em] text-gold-300/70 uppercase">
            Shri Kamatchi Mahal • Karur, Tamil Nadu • 2026
          </div>
        </div>
      </div>
    </section>
  );
};
