import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export const AudioController: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const unsub = audioEngine.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return unsub;
  }, []);

  const handleToggle = () => {
    audioEngine.toggle();
  };

  return (
    <div className="fixed bottom-5 left-5 z-50 select-none">
      <button
        onClick={handleToggle}
        aria-label={isPlaying ? "Mute music" : "Play music"}
        title={isPlaying ? "Mute music" : "Play music"}
        className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-plum-950/85 hover:bg-plum-900 border border-gold-400/50 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none"
      >
        {isPlaying && (
          <span className="absolute -inset-1 rounded-full bg-gold-400/20 animate-ping pointer-events-none" />
        )}

        {isPlaying ? (
          <Volume2 className="w-5 h-5 text-gold-300 group-hover:text-gold-100 transition-colors" />
        ) : (
          <VolumeX className="w-5 h-5 text-gold-500/80 group-hover:text-gold-300 transition-colors" />
        )}
      </button>
    </div>
  );
};
