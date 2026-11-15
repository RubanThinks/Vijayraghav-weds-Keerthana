import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronRight } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface IntroExperienceProps {
  onComplete: () => void;
}

export const IntroExperience: React.FC<IntroExperienceProps> = ({ onComplete }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);
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

  // Update progress bar as video plays
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress((video.currentTime / video.duration) * 100);
  };

  // Attempt autoplay on mount (muted video + audio track starts playing right away)
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay may be restricted until user interacts
      });
    }
    // Start background audio from initial loading
    audioEngine.play();
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#1F0212] overflow-hidden transition-opacity duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Cinematic Background Video - uncropped, native aspect ratio, muted by default */}
      <video
        ref={videoRef}
        src="/assets/video/wedding-intro.mp4"
        playsInline
        autoPlay
        muted
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleFinish}
        className="w-full h-full object-contain object-center select-none"
      />

      {/* Subtle Luxury Vignette Overlay to Blend Edges */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#1F0212]/70 via-transparent to-[#1F0212]/50" />

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

      {/* Bottom Right: Single Skip Intro Button */}
      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30">
        <button
          onClick={handleFinish}
          className="group flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-500 hover:bg-gold-400 text-plum-950 font-sans text-xs font-bold tracking-widest uppercase transition-all shadow-[0_4px_20px_rgba(224,180,119,0.35)] hover:scale-105 active:scale-95"
        >
          <span>Skip Intro</span>
          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Subtle Video Playback Progress Line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-wine-900/60 z-20 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold-500 to-gold-300 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default IntroExperience;
