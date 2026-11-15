import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Sparkles, Download, ExternalLink, Flame } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { MonogramVK } from './MonogramVK';

export const WeddingCeremonySection: React.FC = () => {
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
    const title = encodeURIComponent("Holy Muhurtham: Vijayraghav weds Keerthana");
    const details = encodeURIComponent(
      `Sacred Tamil Wedding Ceremony (Muhurtham) of Vijayraghav & Keerthana.\nDate: 13 December 2026 (4:30 AM - 6:00 AM IST)\nVenue: ${venue.fullAddress}`
    );
    const location = encodeURIComponent(venue.fullAddress);
    const dates = "20261212T230000Z/20261213T003000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  const downloadIcs = () => {
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Vijayraghav & Keerthana Wedding//EN",
      "BEGIN:VEVENT",
      `SUMMARY:Holy Muhurtham - Vijayraghav weds Keerthana`,
      `DESCRIPTION:Sacred Tamil Wedding Ceremony of Vijayraghav and Keerthana at Shri Kamatchi Mahal, Karur.`,
      `LOCATION:${venue.fullAddress}`,
      `DTSTART:20261212T230000Z`,
      `DTEND:20261213T003000Z`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `muhurtham-vijayraghav-keerthana.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="ceremony" className="screen-section relative overflow-hidden bg-wine-950 flex items-center justify-center select-none">
      {/* 100% Full Viewport on Mobile (Zero Gaps), 16:9 on Desktop */}
      <div className="relative w-full h-[100dvh] min-h-[100dvh] md:min-h-0 md:h-[min(100dvh,calc(100vw*9/16))] md:w-[min(100vw,calc(100dvh*16/9))] md:aspect-[16/9] flex items-center justify-center overflow-hidden select-none shadow-2xl">
        
        {/* Dedicated Holy Muhurtham Background Artwork (Traditional Tamil Mandapam & Lamps) */}
        <picture className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
          <source media="(max-width: 767px)" srcSet="/assets/backgrounds/wedding-mobile.jpg" />
          <img
            src="/assets/backgrounds/wedding-desktop.jpg"
            alt="Holy Muhurtham Wedding Ceremony Stage Background"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        </picture>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center text-center justify-between h-full pt-16 pb-6 sm:pt-20 sm:pb-8 md:pt-8 md:pb-6 px-4">
          
          {/* Header */}
          <div className="flex flex-col items-center mt-1 sm:mt-2">
            <MonogramVK size={isDesktop ? 44 : 34} className="mb-1" />
            <div className="flex items-center gap-2">
              <span className="h-px w-6 sm:w-12 bg-gradient-to-r from-transparent to-gold-400" />
              <span className="font-cinzel text-[10px] sm:text-xs tracking-[0.35em] uppercase text-gold-300 font-semibold text-shadow-deep">
                Sacred Muhurtham
              </span>
              <span className="h-px w-6 sm:w-12 bg-gradient-to-l from-transparent to-gold-400" />
            </div>

            <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-ivory-50 tracking-wide mt-1 text-shadow-deep">
              Wedding Ceremony
            </h2>
            <span className="font-cinzel text-xs text-gold-300/80 font-medium tracking-widest mt-0.5">
              திருமண வைபவம் (மாங்கல்ய தாரணம்)
            </span>
          </div>

          {/* Central Information Card */}
          <div className="w-full max-w-lg p-4 sm:p-6 rounded-3xl bg-plum-950/85 border border-gold-400/40 shadow-2xl flex flex-col items-center my-auto">
            
            {/* Event Name */}
            <span className="font-cinzel font-bold text-lg sm:text-xl md:text-2xl text-gold-gradient tracking-wide uppercase">
              HOLY MUHURTHAM
            </span>

            {/* Brahma Muhurtham Tag */}
            <div className="mt-1 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-200 text-[10px] font-serif italic">
              <Flame className="w-3 h-3 text-gold-400" />
              <span>பிரம்ம முகூர்த்த வேளை (Brahma Muhurtham)</span>
            </div>

            {/* Champagne Gold Decorative Separator */}
            <div className="flex items-center justify-center gap-2 my-2 w-36 sm:w-48">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold-400" />
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold-400" />
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-ivory-100 font-serif text-base sm:text-lg md:text-xl font-medium">
              <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
              <span>13 December 2026</span>
            </div>

            {/* Time */}
            <div className="flex items-center gap-2 text-gold-200 font-sans text-xs sm:text-sm font-semibold tracking-wide mt-1">
              <Clock className="w-4 h-4 text-gold-400 shrink-0" />
              <span>4:30 AM – 6:00 AM IST</span>
            </div>

            {/* Venue Details */}
            <div className="mt-3 pt-3 border-t border-gold-400/25 w-full flex flex-col items-center">
              <div className="flex items-center gap-1.5 text-gold-300 font-serif italic text-base sm:text-lg">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="font-bold">{venue.name}</span>
              </div>
              <p className="font-sans text-[11px] sm:text-xs text-ivory-200/90 mt-0.5">
                Karur, Tamil Nadu
              </p>
            </div>

            {/* Calendar Actions */}
            <div className="mt-4 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gold-500 hover:bg-gold-400 text-plum-950 font-sans text-[11px] font-semibold tracking-wider uppercase transition-all shadow-md hover:scale-105"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Google Calendar</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>

              <button
                onClick={downloadIcs}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-plum-900/90 hover:bg-plum-850 text-gold-200 border border-gold-500/40 font-sans text-[11px] font-semibold tracking-wider uppercase transition-all shadow-md hover:scale-105"
              >
                <Download className="w-3.5 h-3.5 text-gold-400" />
                <span>Apple / iCal</span>
              </button>
            </div>
          </div>

          {/* Bottom Footnote */}
          <div className="mb-2">
            <p className="font-serif italic text-xs text-gold-200/80">
              Your esteemed presence and blessings are cordially solicited
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
