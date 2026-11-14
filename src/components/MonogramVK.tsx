import React from 'react';

interface MonogramVKProps {
  className?: string;
  size?: number; // Outer container size in px
  showBorder?: boolean;
}

/**
 * Modern Luxury Text-Based Monogram Logo for Vijayraghav & Keerthana (VK)
 * Uses high-end Cinzel Decorative serif typography with joined letters
 * styled in metallic champagne gold gradient, avoiding artificial SVG/CSS path recreation.
 */
export const MonogramVK: React.FC<MonogramVKProps> = ({
  className = '',
  size = 48,
  showBorder = true,
}) => {
  const fontSize = Math.round(size * 0.54);

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`relative inline-flex items-center justify-center select-none shrink-0 ${showBorder
          ? 'rounded-full bg-gradient-to-b from-[#380622]/90 via-[#270317]/95 to-[#1F0212]/95 border border-gold-400/50 shadow-[0_2px_14px_rgba(224,180,119,0.22)]'
          : ''
        } ${className}`}
      aria-label="VK Monogram"
    >
      {/* Subtle Inner Gold Ring (Only if bordered) */}
      {showBorder && (
        <div className="absolute inset-[2px] rounded-full border border-gold-400/25 pointer-events-none" />
      )}

      {/* Modern Luxury Joined Typography Logo: V & K intertwined */}
      <div
        className="relative flex items-center justify-center font-cinzelDeco font-bold leading-none select-none tracking-tight"
        style={{ fontSize: `${fontSize}px` }}
      >
        {/* Letter V */}
        <span className="text-gold-gradient drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] inline-block transform -translate-x-[0.02em]">
          V
        </span>

        {/* Letter K - Joined seamlessly to V with negative overlap */}
        <span className="text-gold-gradient drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] inline-block -ml-[0.15em] transform translate-x-[0.02em]">
          K
        </span>
      </div>
    </div>
  );
};

export default MonogramVK;
