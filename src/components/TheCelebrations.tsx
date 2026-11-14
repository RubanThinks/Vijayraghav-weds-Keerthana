import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, Shirt, Download, ExternalLink } from 'lucide-react';
import { weddingData, type EventDetail } from '../data/weddingData';
import { RawBackground } from './RawBackground';

export const TheCelebrations: React.FC = () => {
  const { events, venue } = weddingData;
  const { reception, wedding } = events;

  const getGoogleCalendarUrl = (ev: EventDetail) => {
    const title = encodeURIComponent(ev.calendarEvent.title);
    const details = encodeURIComponent(`${ev.description}\nVenue: ${venue.fullAddress}`);
    const location = encodeURIComponent(venue.fullAddress);
    let dates = "";
    if (ev.id === 'reception') {
      dates = "20261212T123000Z/20261212T143000Z";
    } else {
      dates = "20261212T230000Z/20261213T003000Z";
    }
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  const downloadIcs = (ev: EventDetail) => {
    let start = ev.id === 'reception' ? "20261212T123000Z" : "20261212T230000Z";
    let end = ev.id === 'reception' ? "20261212T143000Z" : "20261213T003000Z";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Vijayraghav & Keerthana Wedding//EN",
      "BEGIN:VEVENT",
      `SUMMARY:${ev.calendarEvent.title}`,
      `DESCRIPTION:${ev.description}`,
      `LOCATION:${venue.fullAddress}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${ev.id}-vijayraghav-keerthana.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="celebrations" className="screen-section px-4 sm:px-6 lg:px-8">
      {/* Plain, Raw, Unblurred 16:9 Desktop & 9:16 Mobile Background */}
      <RawBackground />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center max-h-[94vh] py-2 w-full">
        {/* Section Header */}
        <div className="text-center mb-3 sm:mb-5">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Calendar className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-cinzel text-[11px] sm:text-xs tracking-[0.35em] uppercase text-gold-300 font-semibold text-shadow-deep">
              The Celebrations
            </span>
            <Calendar className="w-3.5 h-3.5 text-gold-400" />
          </div>

          <h2 className="font-serif italic text-2xl sm:text-4xl md:text-5xl text-ivory-50 tracking-wide text-shadow-deep">
            Auspicious Ceremonies
          </h2>
          <p className="font-sans text-[10px] sm:text-xs text-gold-300/90 tracking-widest uppercase mt-0.5 text-shadow-deep">
            Both events celebrated at <span className="underline font-semibold text-gold-200">Shri Kamatchi Mahal, Karur</span>
          </p>
        </div>

        {/* 2 Ceremonies Cards Grid (Fits cleanly into 16:9 screen) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl">
          
          {/* EVENT 01: RECEPTION */}
          <div className="relative rounded-3xl p-5 sm:p-6 luxury-card flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-300 text-[10px] font-sans uppercase tracking-widest font-semibold mb-2 w-fit">
                <Sparkles className="w-3 h-3 text-gold-400" />
                <span>Grand Reception</span>
              </div>

              <h3 className="font-cinzel text-xl sm:text-2xl text-gold-gradient font-bold leading-tight">
                {reception.name}
              </h3>
              {reception.tamilName && (
                <p className="font-serif italic text-gold-200/80 text-xs mt-0.5">
                  {reception.tamilName}
                </p>
              )}

              <div className="mt-3 space-y-1.5 text-xs text-ivory-100 font-sans">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="font-semibold">{reception.formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{reception.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="font-medium text-gold-200">{reception.venue}, {reception.venueCity}</span>
                </div>
              </div>

              <div className="mt-2.5 p-2.5 rounded-xl bg-wine-900/60 border border-gold-500/20 flex items-center gap-2">
                <Shirt className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="font-sans text-[11px] text-ivory-100">
                  Attire: {reception.attireSuggestion}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gold-500/20 flex items-center gap-2">
              <a
                href={getGoogleCalendarUrl(reception)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-sans text-[11px] font-semibold tracking-wider uppercase transition-all shadow-md"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Calendar</span>
              </a>
              <button
                onClick={() => downloadIcs(reception)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-wine-900/90 hover:bg-wine-850 text-gold-200 border border-gold-500/35 font-sans text-[11px] font-medium tracking-wider uppercase transition-all"
              >
                <Download className="w-3 h-3 text-gold-400" />
                <span>.ics</span>
              </button>
            </div>
          </div>

          {/* EVENT 02: WEDDING MUHURTHAM */}
          <div className="relative rounded-3xl p-5 sm:p-6 luxury-card-gold flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-500/25 border border-gold-400/50 text-gold-200 text-[10px] font-sans uppercase tracking-widest font-semibold mb-2 w-fit">
                <Sparkles className="w-3 h-3 text-gold-300" />
                <span>Sacred Muhurtham</span>
              </div>

              <h3 className="font-cinzel text-xl sm:text-2xl text-gold-gradient font-bold leading-tight">
                {wedding.name}
              </h3>
              {wedding.tamilName && (
                <p className="font-serif italic text-gold-200/80 text-xs mt-0.5">
                  {wedding.tamilName}
                </p>
              )}

              <div className="mt-3 space-y-1.5 text-xs text-ivory-100 font-sans">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="font-semibold">{wedding.formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="font-medium text-gold-300">{wedding.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                  <span className="font-medium text-gold-200">{wedding.venue}, {wedding.venueCity}</span>
                </div>
              </div>

              <div className="mt-2.5 p-2.5 rounded-xl bg-wine-900/60 border border-gold-500/20 flex items-center gap-2">
                <Shirt className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="font-sans text-[11px] text-ivory-100">
                  Attire: {wedding.attireSuggestion}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gold-500/20 flex items-center gap-2">
              <a
                href={getGoogleCalendarUrl(wedding)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-sans text-[11px] font-semibold tracking-wider uppercase transition-all shadow-md"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Calendar</span>
              </a>
              <button
                onClick={() => downloadIcs(wedding)}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-wine-900/90 hover:bg-wine-850 text-gold-200 border border-gold-500/35 font-sans text-[11px] font-medium tracking-wider uppercase transition-all"
              >
                <Download className="w-3 h-3 text-gold-400" />
                <span>.ics</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
