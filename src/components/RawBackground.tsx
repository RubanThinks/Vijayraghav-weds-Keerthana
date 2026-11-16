import React from 'react';

export const RawBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
      <picture>
        <source media="(max-width: 767px)" srcSet="/assets/backgrounds/hero-mobile.jpg" />
        <img
          src="/assets/backgrounds/hero-desktop.jpg"
          alt="Vijayraghav & Keerthana Botanical Background"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
      </picture>
    </div>
  );
};

