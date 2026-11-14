import React from 'react';

interface MonogramVKProps {
  className?: string;
  size?: number;
}

export const MonogramVK: React.FC<MonogramVKProps> = ({ className = '', size = 64 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${className}`}
      aria-label="V & K Monogram"
    >
      <defs>
        {/* Soft Champagne Gold Metallic Gradient */}
        <linearGradient id="vkGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF7E6" />
          <stop offset="25%" stopColor="#E0B477" />
          <stop offset="60%" stopColor="#B17D3E" />
          <stop offset="85%" stopColor="#E0B477" />
          <stop offset="100%" stopColor="#8A5C28" />
        </linearGradient>

        {/* Soft Glow Filter */}
        <filter id="vkGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#B17D3E" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Decorative Outer Filigree Ring */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="url(#vkGoldGrad)"
        strokeWidth="1.2"
        strokeDasharray="2 4"
        opacity="0.7"
      />
      <circle
        cx="50"
        cy="50"
        r="41"
        stroke="url(#vkGoldGrad)"
        strokeWidth="0.8"
        opacity="0.85"
      />

      {/* 4 Cardinal Diamond Accents */}
      <polygon points="50,6 52,9 50,12 48,9" fill="url(#vkGoldGrad)" />
      <polygon points="50,88 52,91 50,94 48,91" fill="url(#vkGoldGrad)" />
      <polygon points="6,50 9,48 12,50 9,52" fill="url(#vkGoldGrad)" />
      <polygon points="88,50 91,48 94,50 91,52" fill="url(#vkGoldGrad)" />

      {/* Intertwined Calligraphic 'V' and 'K' Lettering */}
      <g filter="url(#vkGlow)">
        {/* Calligraphic V */}
        <path
          d="M26 31 C29 31, 33 34, 35 41 L44 68 C45 71, 46 72, 48 72 C50 72, 51 71, 53 66 L64 36 C66 33, 68 31, 72 31"
          stroke="url(#vkGoldGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* V Left Flourish Loop */}
        <path
          d="M23 34 C21 31, 23 27, 27 27 C31 27, 34 30, 34 34"
          stroke="url(#vkGoldGrad)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Calligraphic K */}
        <path
          d="M48 26 L48 74 M48 50 L67 30 M55 45 L69 74"
          stroke="url(#vkGoldGrad)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* K Serif flourishes */}
        <path
          d="M44 26 L52 26 M44 74 L53 74 M64 28 C67 28, 70 30, 71 33 M65 74 L73 74"
          stroke="url(#vkGoldGrad)"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Central Intertwining Ampersand / Heart Accent */}
        <path
          d="M48 46 C46 43, 43 43, 42 45 C41 47, 43 50, 48 54 C53 50, 55 47, 54 45 C53 43, 50 43, 48 46 Z"
          fill="url(#vkGoldGrad)"
          opacity="0.9"
        />
      </g>
    </svg>
  );
};
