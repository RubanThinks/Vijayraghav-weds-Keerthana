import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CalendarCheck, Users, Check, MessageSquare, Heart } from 'lucide-react';
import { weddingData } from '../data/weddingData';
import { RawBackground } from './RawBackground';

export const RsvpSection: React.FC = () => {
  const { couple, venue } = weddingData;

  const [fullName, setFullName] = useState<string>('');
  const [guestCount, setGuestCount] = useState<string>('2');
  const [attendingEvent, setAttendingEvent] = useState<string>('both');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#ffd700', '#d4af37', '#ffffff', '#e63946'],
      });
    } catch {
      // Ignore
    }
  };

  const getWhatsAppRsvpUrl = () => {
    const eventText =
      attendingEvent === 'both'
        ? 'Both Reception (12 Dec) & Muhurtham (13 Dec)'
        : attendingEvent === 'reception'
        ? 'Grand Reception (12 Dec)'
        : 'Sacred Muhurtham (13 Dec)';

    const text = encodeURIComponent(
      `Namaste! 🙏\n\nI am delighted to confirm my RSVP for the wedding celebration of *${couple.combinedName}*!\n\n` +
      `👤 Guest Name: ${fullName || 'Guest'}\n` +
      `👥 Total Attending: ${guestCount} member(s)\n` +
      `📅 Attending Events: ${eventText}\n` +
      `📍 Venue: ${venue.name}, ${venue.city}\n\n` +
      `Looking forward to celebrating with you and showering the couple with our heartfelt blessings! ✨`
    );

    return `https://api.whatsapp.com/send?text=${text}`;
  };

  return (
    <section id="rsvp" className="screen-section px-4 sm:px-6 lg:px-8">
      {/* Plain, Raw, Unblurred 16:9 Desktop & 9:16 Mobile Background */}
      <RawBackground />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center justify-center py-8 sm:py-6 w-full">
        {/* Section Header */}
        <div className="text-center mb-3 sm:mb-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <CalendarCheck className="w-3.5 h-3.5 text-gold-400" />
            <span className="font-cinzel text-[11px] sm:text-xs tracking-[0.35em] uppercase text-gold-300 font-semibold text-shadow-deep">
              Kindly Respond
            </span>
            <CalendarCheck className="w-3.5 h-3.5 text-gold-400" />
          </div>

          <h2 className="font-serif italic text-2xl sm:text-4xl md:text-5xl text-ivory-50 tracking-wide text-shadow-deep">
            Will You Join Our Celebration?
          </h2>
          <p className="font-sans text-[10px] sm:text-xs text-gold-300/90 tracking-widest uppercase mt-0.5 text-shadow-deep">
            Please let us know so we can prepare our heartfelt hospitality
          </p>
        </div>

        {/* RSVP Card Form */}
        <div className="p-4 sm:p-6 rounded-3xl luxury-card-gold w-full shadow-2xl">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-cinzel text-xl sm:text-2xl text-gold-gradient font-bold">
                Thank You, {fullName}!
              </h3>
              <p className="font-serif italic text-xs sm:text-sm text-ivory-100/90 max-w-md mx-auto">
                Your presence means the world to Vijayraghav and Keerthana. We look forward to welcoming you at Shri Kamatchi Mahal, Karur!
              </p>

              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <a
                  href={getWhatsAppRsvpUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-semibold tracking-wider uppercase transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send via WhatsApp</span>
                </a>

                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 rounded-full bg-wine-900/90 text-gold-200 border border-gold-500/30 text-xs font-sans uppercase tracking-wider hover:bg-wine-850 transition-all"
                >
                  Update Response
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="rsvpName" className="block text-[11px] font-sans uppercase tracking-wider text-gold-300 font-medium mb-1">
                    Your Name / Family *
                  </label>
                  <input
                    id="rsvpName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sivasubramanian & Family"
                    className="w-full px-3.5 py-2 rounded-xl bg-wine-950/90 border border-gold-500/35 text-ivory-100 text-xs focus:outline-none focus:border-gold-400"
                  />
                </div>

                <div>
                  <label htmlFor="guestCount" className="block text-[11px] font-sans uppercase tracking-wider text-gold-300 font-medium mb-1">
                    Attendees
                  </label>
                  <div className="relative">
                    <select
                      id="guestCount"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-wine-950/90 border border-gold-500/35 text-ivory-100 text-xs focus:outline-none focus:border-gold-400 appearance-none cursor-pointer"
                    >
                      <option value="1">1 Member</option>
                      <option value="2">2 Members</option>
                      <option value="3">3 Members</option>
                      <option value="4">4 Members</option>
                      <option value="5+">5+ Members</option>
                    </select>
                    <Users className="w-3.5 h-3.5 text-gold-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-sans uppercase tracking-wider text-gold-300 font-medium mb-1">
                  Which Events Will You Attend?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'both', label: 'Both Events', sub: '12 & 13 Dec' },
                    { id: 'reception', label: 'Reception', sub: '12 Dec • 6 PM' },
                    { id: 'wedding', label: 'Muhurtham', sub: '13 Dec • 4:30 AM' },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex flex-col p-2 rounded-xl border cursor-pointer transition-all ${
                        attendingEvent === opt.id
                          ? 'bg-gold-500/25 border-gold-400 text-gold-100'
                          : 'bg-wine-900/60 border-gold-500/20 text-ivory-200/80 hover:border-gold-500/40'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <input
                          type="radio"
                          name="attendingEvent"
                          value={opt.id}
                          checked={attendingEvent === opt.id}
                          onChange={(e) => setAttendingEvent(e.target.value)}
                          className="accent-gold-400"
                        />
                        <span className="font-cinzel text-[11px] font-semibold">{opt.label}</span>
                      </div>
                      <span className="text-[9px] font-sans text-gold-300/70 mt-0.5 pl-4">{opt.sub}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-1 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  className="w-full sm:flex-1 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-sans text-xs font-semibold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Heart className="w-3.5 h-3.5 fill-navy-950" />
                  <span>Confirm RSVP Attendance</span>
                </button>

                <a
                  href={getWhatsAppRsvpUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2.5 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-white font-sans text-xs font-medium tracking-wider uppercase transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>RSVP via WhatsApp</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
