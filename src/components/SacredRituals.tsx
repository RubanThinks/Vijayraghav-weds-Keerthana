import React from 'react';
import { Sparkles, Flower2, Heart, Flame, Sun, Gem } from 'lucide-react';
import { RawBackground } from './RawBackground';

interface Ritual {
  name: string;
  tamilName: string;
  timing: string;
  description: string;
  icon: React.ElementType;
}

export const SacredRituals: React.FC = () => {
  const rituals: Ritual[] = [
    {
      name: "Kaapu Kettuthal & Vratham",
      tamilName: "காப்பு கட்டுதல் & விரதம்",
      timing: "Auspicious Morning",
      description: "Sacred turmeric protection threads are tied on the wrists invoking divine blessings from Lord Murugan.",
      icon: Sun,
    },
    {
      name: "Kasi Yathirai",
      tamilName: "காசி யாத்திரை",
      timing: "Pre-Muhurtham Dawn",
      description: "A cherished tradition where the groom is lovingly persuaded to return and choose companionship.",
      icon: Sparkles,
    },
    {
      name: "Maalai Maatral",
      tamilName: "மாலை மாற்றுதல்",
      timing: "Dawn Muhurtham",
      description: "A joyous celebration as Vijayraghav & Keerthana exchange fragrant garlands amidst cheers.",
      icon: Flower2,
    },
    {
      name: "Oonjal Ceremony",
      tamilName: "ஊஞ்சல் வைபவம்",
      timing: "Muhurtham Morning",
      description: "The couple sways on a royal swing to traditional Carnatic songs sung by family elders.",
      icon: Heart,
    },
    {
      name: "Mangalyadharanam",
      tamilName: "மாங்கல்யதாரணம்",
      timing: "4:30 AM – 6:00 AM",
      description: "The golden Thirumaangalyam is tied with three sacred knots as the Nadaswaram crescendos.",
      icon: Gem,
    },
    {
      name: "Saptapadi & Agni",
      tamilName: "சப்தபதி & அக்னி வலம்",
      timing: "Seven Sacred Vows",
      description: "Seven sacred steps around Agni fire, sealing timeless vows of love and lifelong devotion.",
      icon: Flame,
    },
  ];

  return (
    <section id="rituals" className="screen-section px-4 sm:px-6 lg:px-8">
      {/* Plain, Raw, Unblurred 16:9 Desktop & 9:16 Mobile Background */}
      <RawBackground />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center py-8 sm:py-6 w-full">
        {/* Section Header */}
        <div className="text-center mb-3 sm:mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-cinzel text-[11px] sm:text-xs tracking-[0.35em] uppercase text-gold-300 font-semibold text-shadow-deep">
              Sacred Traditions
            </span>
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          </div>

          <h2 className="font-serif italic text-2xl sm:text-4xl md:text-5xl text-ivory-50 tracking-wide text-shadow-deep">
            South Indian Wedding Rituals
          </h2>
          <p className="font-sans text-[10px] sm:text-xs text-gold-300/90 tracking-widest uppercase mt-0.5 text-shadow-deep">
            Timeless Vedic ceremonies celebrating eternal union
          </p>
        </div>

        {/* Rituals Grid (6 rituals in 3x2, compact & fitting inside 16:9) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 w-full">
          {rituals.map((ritual, idx) => {
            const Icon = ritual.icon;
            const isHighlight = ritual.name.includes("Mangalyadharanam");
            return (
              <div
                key={idx}
                className={`p-3 sm:p-4 rounded-2xl flex flex-col justify-between transition-all ${
                  isHighlight ? 'luxury-card-gold border-gold-400/60 shadow-lg' : 'luxury-card'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gold-500/20 border border-gold-400/35 flex items-center justify-center text-gold-300">
                      <Icon className="w-3.5 h-3.5 text-gold-400" />
                    </span>
                    <span className="font-sans text-[9px] uppercase tracking-wider text-gold-300/80 bg-wine-900/80 px-2 py-0.5 rounded-full border border-gold-500/20">
                      {ritual.timing}
                    </span>
                  </div>

                  <h3 className="font-cinzel text-xs sm:text-sm font-bold text-gold-gradient leading-tight">
                    {ritual.name}
                  </h3>
                  <p className="font-serif italic text-gold-200/80 text-[10px]">
                    {ritual.tamilName}
                  </p>

                  <p className="font-sans text-[10px] sm:text-[11px] text-ivory-200/90 leading-relaxed mt-1 line-clamp-3">
                    {ritual.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
