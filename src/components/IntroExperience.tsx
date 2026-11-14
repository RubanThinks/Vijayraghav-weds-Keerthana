import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Volume2, VolumeX, Sparkles, ChevronRight } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface IntroExperienceProps {
  onComplete: () => void;
}

interface Scene {
  subtitle?: string;
  title: string;
  isCalligraphy?: boolean;
  highlight?: string;
  tagline?: string;
  dateBadge?: string;
}

export const IntroExperience: React.FC<IntroExperienceProps> = ({ onComplete }) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [hasStartedAudio, setHasStartedAudio] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const scenes: Scene[] = [
    {
      title: "Two hearts, one beautiful journey...",
      tagline: "A sacred union written in the stars",
    },
    {
      subtitle: "With the divine grace of Lord Murugan &",
      title: "The blessings of our families...",
      tagline: "We begin a lifetime of devotion and happiness",
    },
    {
      subtitle: "The Bride",
      title: "Keerthana",
      isCalligraphy: true,
      tagline: "Radiant with grace and eternal hope",
    },
    {
      title: "Invites you to celebrate the wedding of",
      tagline: "As two souls become one",
    },
    {
      subtitle: "The Groom",
      title: "Vijayraghav",
      isCalligraphy: true,
      tagline: "Honoring heritage, stepping forward with devotion",
    },
    {
      subtitle: "Save The Sacred Date",
      title: "13 December 2026",
      dateBadge: "Brahma Muhurtham • Shri Kamatchi Mahal, Karur",
      tagline: "A day etched in timeless love",
    },
    {
      subtitle: "Vijayraghav weds Keerthana",
      title: "Together, let us celebrate forever.",
      tagline: "Welcome to our wedding invitation",
    },
  ];

  const handleFinish = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 900);
  }, [onComplete]);

  // Handle scene progression
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentSceneIndex < scenes.length - 1) {
        setCurrentSceneIndex((prev) => prev + 1);
      } else {
        handleFinish();
      }
    }, 4200);

    return () => clearTimeout(timer);
  }, [currentSceneIndex, scenes.length, handleFinish]);

  // Particle and light leaks canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle system: gold dust and soft rose petals
    const particleCount = 70;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: Math.random() * 0.7 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * 0.03,
      hue: Math.random() > 0.3 ? 45 : 340, // Gold or delicate rose
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep cinematic vignetted radial glow
      const grad = ctx.createRadialGradient(
        width / 2,
        height * 0.45,
        50,
        width / 2,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      grad.addColorStop(0, 'rgba(58, 8, 46, 0.55)'); // Warm royal wine plum
      grad.addColorStop(0.5, 'rgba(32, 4, 26, 0.85)'); // Deep burgundy wine
      grad.addColorStop(1, 'rgba(18, 2, 14, 0.98)'); // Midnight wine base
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render floating particles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.alpha += Math.sin(Date.now() * p.pulse) * 0.01;

        if (p.y > height + 10) {
          p.y = -10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          p.hue === 45
            ? `rgba(255, 215, 120, ${Math.max(0.1, Math.min(0.9, p.alpha))})`
            : `rgba(255, 180, 195, ${Math.max(0.1, Math.min(0.7, p.alpha))})`;
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = p.size > 2 ? 8 : 2;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleStartMusic = () => {
    setHasStartedAudio(true);
    audioEngine.play();
  };

  const handleMute = () => {
    audioEngine.toggle();
  };

  const curScene = scenes[currentSceneIndex];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-wine-950 transition-opacity duration-1000 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Cinematic Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Subtle Gold Filigree Frame */}
      <div className="absolute inset-4 sm:inset-8 border border-gold-500/20 pointer-events-none rounded-2xl flex flex-col justify-between p-4 sm:p-8">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 border-t-2 border-l-2 border-gold-400/40 rounded-tl-lg" />
          <div className="w-12 h-12 border-t-2 border-r-2 border-gold-400/40 rounded-tr-lg" />
        </div>
        <div className="flex justify-between items-end">
          <div className="w-12 h-12 border-b-2 border-l-2 border-gold-400/40 rounded-bl-lg" />
          <div className="w-12 h-12 border-b-2 border-r-2 border-gold-400/40 rounded-br-lg" />
        </div>
      </div>

      {/* Top Bar: Audio Toggle & Skip Intro */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={hasStartedAudio ? handleMute : handleStartMusic}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-900/80 border border-gold-500/30 text-gold-300 hover:text-gold-100 hover:border-gold-400/60 backdrop-blur-md text-xs font-sans tracking-wider uppercase transition-all shadow-lg hover:scale-105 active:scale-95"
          >
            {audioEngine.getIsPlaying() ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-gold-400" />
                <span>Music Playing</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-gold-500/80" />
                <span>{hasStartedAudio ? 'Unmute Music' : 'Play Music 🎵'}</span>
              </>
            )}
          </button>
        </div>

        <button
          onClick={handleFinish}
          className="group flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/15 hover:bg-gold-500/25 border border-gold-400/40 text-gold-200 hover:text-white backdrop-blur-md text-xs font-sans tracking-widest uppercase transition-all shadow-lg hover:scale-105 active:scale-95"
        >
          <span>Skip Intro</span>
          <ChevronRight className="w-3.5 h-3.5 text-gold-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Central Storytelling Content */}
      <div className="relative z-10 max-w-4xl px-6 text-center select-none">
        <div key={currentSceneIndex} className="animate-[fadeIn_0.9s_ease-out]">
          {/* Subtitle / Context */}
          {curScene.subtitle && (
            <p className="font-sans text-xs sm:text-sm tracking-[0.35em] uppercase text-gold-300/80 mb-4 sm:mb-6 font-medium">
              {curScene.subtitle}
            </p>
          )}

          {/* Main Title / Names */}
          {currentSceneIndex === 1 && (
            <div className="relative my-4 flex items-center justify-center">
              <div className="relative w-32 sm:w-44 h-auto">
                <img
                  src="/assets/deity/lord-murugan.png"
                  alt="Lord Murugan"
                  className="w-full h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
                />
              </div>
            </div>
          )}

          {curScene.isCalligraphy ? (
            <h1 className="font-calligraphy text-6xl sm:text-8xl md:text-9xl text-gold-gradient py-2 my-2 drop-shadow-2xl font-normal leading-tight">
              {curScene.title}
            </h1>
          ) : (
            <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-ivory-50 tracking-wider font-light leading-snug max-w-3xl mx-auto">
              {curScene.title}
            </h2>
          )}

          {/* Date Badge */}
          {curScene.dateBadge && (
            <div className="inline-block mt-4 px-6 py-2 rounded-full border border-gold-400/40 bg-gold-500/10 backdrop-blur-sm">
              <p className="font-cinzel text-sm sm:text-base text-gold-200 tracking-widest font-semibold">
                {curScene.dateBadge}
              </p>
            </div>
          )}

          {/* Tagline */}
          {curScene.tagline && (
            <p className="font-serif italic text-base sm:text-xl md:text-2xl text-ivory-200/70 mt-6 tracking-wide">
              "{curScene.tagline}"
            </p>
          )}
        </div>
      </div>

      {/* Bottom Scene Timeline Dots & Quick Enter */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-4 z-20">
        <div className="flex items-center gap-2">
          {scenes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSceneIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                idx === currentSceneIndex
                  ? 'w-8 bg-gold-400 shadow-[0_0_10px_#ffd700]'
                  : 'w-2 bg-gold-500/30 hover:bg-gold-500/50'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleFinish}
          className="flex items-center gap-1.5 text-[11px] font-sans tracking-[0.25em] uppercase text-gold-300/70 hover:text-gold-200 transition-colors"
        >
          <Sparkles className="w-3 h-3 text-gold-400" />
          <span>Enter Invitation</span>
        </button>
      </div>
    </div>
  );
};

