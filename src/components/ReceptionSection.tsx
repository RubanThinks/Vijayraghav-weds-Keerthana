import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Sparkles, Download, ExternalLink } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { MonogramVK } from './MonogramVK';

export const ReceptionSection: React.FC = () => {
  const { venue } = weddingData;
  const [isDesktop, setIsDesktop] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent("Grand Reception: Vijayraghav weds Keerthana");
    const details = encodeURIComponent(
      `Grand Reception celebration of Vijayraghav & Keerthana.\nDate: 12 December 2026 (6:00 PM - 8:00 PM)\nVenue: ${venue.fullAddress}`
    );
    const location = encodeURIComponent(venue.fullAddress);
    const dates = "20261212T123000Z/20261212T143000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  const downloadIcs = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Vijayraghav & Keerthana Wedding//EN",
      "BEGIN:VEVENT",
      `SUMMARY:Grand Reception - Vijayraghav weds Keerthana`,
      `DESCRIPTION:Grand Wedding Reception of Vijayraghav and Keerthana at Shri Kamatchi Mahal, Karur.`,
      `LOCATION:${venue.fullAddress}`,
      `DTSTART:20261212T123000Z`,
      `DTEND:20261212T143000Z`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `reception-vijayraghav-keerthana.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="reception" className="screen-section relative overflow-hidden bg-wine-950 flex items-center justify-center select-none">
      {/* 100% Full Viewport on Mobile (Zero Gaps), 16:9 on Desktop */}
      <div className="relative w-full h-[100dvh] min-h-[100dvh] md:min-h-0 md:h-[min(100dvh,calc(100vw*9/16))] md:w-[min(100vw,calc(100dvh*16/9))] md:aspect-[16/9] flex items-center justify-center overflow-hidden select-none shadow-2xl">
        
        {/* Exact Uploaded Reception Background Artwork */}
        <picture className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
          <source media="(max-width: 767px)" srcSet="/assets/backgrounds/reception-mobile.jpg" />
          <img
            src="/assets/backgrounds/reception-desktop.jpg"
            alt="Wedding Reception Background"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </picture>

        {/* Content Container - Framed Beautifully in the Central Stage Space */}
        <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center justify-between h-full pt-16 pb-6 sm:pt-20 sm:pb-8 md:pt-8 md:pb-6 px-4">
          
          {/* Header - Shifted Down to Middle-to-Top Space */}
          <div className="flex flex-col items-center mt-1 sm:mt-2">
            <MonogramVK size={isDesktop ? 46 : 36} className="mb-1" />
            <div className="flex items-center gap-2">
              <span className="h-px w-8 sm:w-16 bg-gradient-to-r from-transparent to-gold-400" />
              <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.35em] uppercase text-gold-300 font-semibold text-shadow-deep">
                Evening of Celebration
              </span>
              <span className="h-px w-8 sm:w-16 bg-gradient-to-l from-transparent to-gold-400" />
            </div>

            <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-ivory-50 tracking-wide mt-1 text-shadow-deep">
              Grand Reception
            </h2>
            <span className="font-cinzel text-[11px] sm:text-xs text-gold-300/85 font-medium tracking-[0.25em] mt-0.5">
              வரவேற்பு நிகழ்ச்சி
            </span>
          </div>

          {/* Luxury Animated Reception Card - Expanded Length & Opulent Royal Styling */}
          <div className="relative w-full max-w-xl sm:max-w-2xl px-6 py-6 sm:px-10 sm:py-8 rounded-3xl bg-gradient-to-b from-plum-950/95 via-wine-950/95 to-plum-950/95 border border-gold-400/60 shadow-[0_0_35px_rgba(212,175,55,0.25)] flex flex-col items-center my-auto overflow-hidden group">
            
            {/* Animated Shimmer Bar across top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent animate-pulse" />

            {/* Corner Filigree Accents */}
            <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-gold-400/50 rounded-tl-sm pointer-events-none" />
            <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-gold-400/50 rounded-tr-sm pointer-events-none" />
            <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-gold-400/50 rounded-bl-sm pointer-events-none" />
            <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-gold-400/50 rounded-br-sm pointer-events-none" />

            {/* Event Pre-title Pill */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-wine-900/80 border border-gold-400/40 shadow-sm mb-2">
              <Sparkles className="w-3 h-3 text-gold-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.3em] uppercase text-gold-300 font-semibold">
                Royal Welcoming
              </span>
            </div>

            {/* Event Name */}
            <h3 className="font-calligraphy text-4xl sm:text-5xl md:text-6xl text-gold-gradient py-0.5 leading-tight">
              Vijayraghav &amp; Keerthana
            </h3>

            {/* Champagne Gold Decorative Separator */}
            <div className="flex items-center justify-center gap-2 my-2 sm:my-3 w-40 sm:w-64">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-400" />
              <div className="w-1.5 h-1.5 rotate-45 bg-gold-400 shadow-sm" />
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-400" />
            </div>

            {/* Date & Day Highlight */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 my-1">
              <div className="flex items-center gap-2 text-ivory-50 font-serif text-lg sm:text-xl md:text-2xl font-semibold">
                <Calendar className="w-5 h-5 text-gold-400 shrink-0" />
                <span>12 December 2026</span>
              </div>
              <span className="hidden sm:inline text-gold-400/50">•</span>
              <div className="flex items-center gap-2 text-gold-200 font-sans text-xs sm:text-sm font-semibold tracking-wider">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Saturday, 6:00 PM – 8:00 PM</span>
              </div>
            </div>

            {/* Venue Details */}
            <div className="mt-3 pt-3 border-t border-gold-400/30 w-full flex flex-col items-center">
              <div className="flex items-center gap-2 text-gold-300 font-serif text-lg sm:text-xl">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="font-bold tracking-wide">{venue.name}</span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-ivory-200/90 mt-0.5 font-normal">
                {venue.city}, {venue.state}
              </p>
            </div>

            {/* Calendar Actions */}
            <div className="mt-5 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:from-gold-400 hover:to-gold-300 text-plum-950 font-sans text-xs font-bold tracking-wider uppercase transition-all shadow-[0_4px_16px_rgba(224,180,119,0.35)] hover:scale-105 active:scale-95"
              >
                <Calendar className="w-4 h-4 text-plum-950" />
                <span>Add to Google Calendar</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-75" />
              </a>

              <button
                onClick={downloadIcs}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-plum-900/95 hover:bg-plum-850 text-gold-200 border border-gold-400/50 font-sans text-xs font-semibold tracking-wider uppercase transition-all shadow-md hover:scale-105 active:scale-95 hover:border-gold-300"
              >
                <Download className="w-4 h-4 text-gold-400" />
                <span>Download iCal / Apple</span>
              </button>
            </div>
          </div>

          {/* Bottom Footnote */}
          <div className="mb-2">
            <p className="font-serif italic text-xs sm:text-sm text-gold-200/85 text-shadow-deep">
              Join us for an evening of music, dining and joyous celebrations
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
