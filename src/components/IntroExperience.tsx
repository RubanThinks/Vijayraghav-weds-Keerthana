import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, ChevronRight, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface IntroExperienceProps {
  onComplete: () => void;
}

export const IntroExperience: React.FC<IntroExperienceProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  const handleFinish = useCallback(() => {
    setIsFadingOut(true);
    // Start background website music when transitioning to the main site
    try {
      audioEngine.play();
    } catch {
      // Ignore autoplay policy restriction if any
    }

    setTimeout(() => {
      onComplete();
    }, 800);
  }, [onComplete]);

  // Handle video audio toggle
  const handleToggleSound = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.muted = false;
      setIsMuted(false);
      video.play().catch(() => {});
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  // Update progress bar as video plays
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);
  };

  // Attempt autoplay on mount
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay may be restricted until user interacts
      });
    }
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#1F0212] overflow-hidden transition-opacity duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Cinematic Background Video - uncropped, native aspect ratio */}
      <video
        ref={videoRef}
        src="/assets/video/wedding-intro.mp4"
        playsInline
        autoPlay
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleFinish}
        className="w-full h-full object-contain object-center select-none"
      />

      {/* Subtle Luxury Vignette Overlay to Blend Edges */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#1F0212]/70 via-transparent to-[#1F0212]/50" />

      {/* Top Action Bar: Audio Controller & Skip Button */}
      <div className="absolute top-5 left-5 right-5 sm:top-7 sm:left-7 sm:right-7 flex items-center justify-between z-20">
        {/* Sound Toggle Button */}
        <button
          onClick={handleToggleSound}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-wine-950/85 hover:bg-wine-900 border border-gold-400/40 text-gold-200 hover:text-gold-100 text-xs font-sans tracking-wider uppercase transition-all shadow-xl hover:scale-105 active:scale-95"
          title={isMuted ? "Unmute Intro Sound" : "Mute Intro Sound"}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-gold-400" />
              <span>Unmute Sound</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-gold-400" />
              <span>Sound On</span>
            </>
          )}
        </button>

        {/* Skip Intro Button */}
        <button
          onClick={handleFinish}
          className="group flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gold-500 hover:bg-gold-400 text-plum-950 font-sans text-xs font-bold tracking-widest uppercase transition-all shadow-[0_4px_16px_rgba(224,180,119,0.35)] hover:scale-105 active:scale-95"
        >
          <span>Skip Intro</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Corner Filigree Ornaments */}
      <div className="absolute inset-4 sm:inset-6 pointer-events-none flex flex-col justify-between z-10 opacity-70">
        <div className="flex justify-between items-start">
          <div className="w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-l-2 border-gold-400/40 rounded-tl-lg" />
          <div className="w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-r-2 border-gold-400/40 rounded-tr-lg" />
        </div>
        <div className="flex justify-between items-end">
          <div className="w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-l-2 border-gold-400/40 rounded-bl-lg" />
          <div className="w-8 h-8 sm:w-12 sm:h-12 border-b-2 border-r-2 border-gold-400/40 rounded-br-lg" />
        </div>
      </div>

      {/* Bottom Controls: Direct Enter Pill & Progress Line */}
      <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3 z-20 px-6">
        <button
          onClick={handleFinish}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-wine-950/85 hover:bg-wine-900 border border-gold-400/35 text-gold-200 text-xs font-sans tracking-[0.25em] uppercase transition-all shadow-lg hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
          <span>Enter Invitation</span>
        </button>

        {/* Video Playback Progress Bar */}
        <div className="w-full max-w-xs h-1 rounded-full bg-wine-900/60 overflow-hidden border border-gold-500/20">
          <div
            className="h-full bg-gradient-to-r from-gold-500 to-gold-300 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default IntroExperience;
