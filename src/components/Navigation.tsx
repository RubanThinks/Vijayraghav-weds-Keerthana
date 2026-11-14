import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUp, Sparkles, MapPin, Calendar, Heart, Clock, BookOpen, CalendarCheck } from 'lucide-react';
import { MonogramVK } from './MonogramVK';

interface NavigationProps {
  onReplayIntro: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onReplayIntro }) => {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      // Show navbar only after scrolling past the hero section
      const threshold = window.innerHeight * 0.45;
      setScrolled(y > threshold);
      setShowBackToTop(y > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Divine Blessings', href: '#hero', icon: Sparkles },
    { label: 'Date Reveal', href: '#scratch-reveal', icon: Heart },
    { label: 'The Couple', href: '#couple', icon: Heart },
    { label: 'Countdown', href: '#countdown', icon: Clock },
    { label: 'Reception', href: '#reception', icon: Calendar },
    { label: 'Muhurtham', href: '#ceremony', icon: Calendar },
    { label: 'Rituals', href: '#rituals', icon: BookOpen },
    { label: 'Venue & Map', href: '#venue', icon: MapPin },
    { label: 'RSVP', href: '#rsvp', icon: CalendarCheck },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Floating Header - Hidden completely in Hero section */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 transform ${
          scrolled
            ? 'translate-y-0 opacity-100 pointer-events-auto py-3 bg-wine-950/95 backdrop-blur-md border-b border-gold-500/25 shadow-2xl shadow-wine-950/80'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Couple Monogram / Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-2.5 group"
          >
            <MonogramVK size={36} className="group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-calligraphy text-2xl text-gold-gradient group-hover:opacity-95 transition-opacity leading-none">
                Vijayraghav weds Keerthana
              </span>
              <span className="font-sans text-[10px] tracking-[0.25em] text-gold-300/70 uppercase">
                13 December 2026
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 px-3 py-1.5 rounded-full bg-wine-900/80 backdrop-blur-md border border-gold-500/25 shadow-inner">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3 py-1.5 text-xs font-sans tracking-wider uppercase text-ivory-100/90 hover:text-gold-200 hover:bg-gold-500/15 rounded-full transition-all duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Intro Replay & Mobile Menu Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={onReplayIntro}
              title="Replay Cinematic Intro"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold-500/35 bg-gold-500/15 hover:bg-gold-500/25 text-gold-200 text-xs font-sans tracking-wider transition-all duration-200"
            >
              <Sparkles className="w-3 h-3 text-gold-400" />
              <span>Cinematic Intro</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden p-2 rounded-lg bg-wine-900/90 border border-gold-500/35 text-gold-300 hover:text-gold-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-wine-950/95 backdrop-blur-xl md:hidden flex flex-col justify-center px-6 pt-20 pb-10 border-b border-gold-500/30 animate-fadeIn">
          <div className="text-center mb-8">
            <h2 className="font-calligraphy text-4xl text-gold-gradient">Vijayraghav &amp; Keerthana</h2>
            <p className="font-sans text-xs tracking-[0.3em] text-gold-300/80 mt-1 uppercase">13 December 2026 • Karur</p>
          </div>

          <div className="flex flex-col gap-3 max-w-sm mx-auto w-full">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl bg-wine-900/80 border border-gold-500/25 text-ivory-100 hover:text-gold-200 hover:border-gold-500/50 transition-all font-sans text-sm tracking-wider uppercase"
                >
                  <Icon className="w-4 h-4 text-gold-400" />
                  <span>{link.label}</span>
                </a>
              );
            })}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onReplayIntro();
              }}
              className="mt-4 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-gold-500/30 to-gold-400/20 border border-gold-400/50 text-gold-200 font-sans text-sm tracking-wider uppercase transition-all"
            >
              <Sparkles className="w-4 h-4 text-gold-300" />
              <span>Replay Cinematic Intro</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-wine-900/90 hover:bg-wine-850 text-gold-300 hover:text-gold-100 border border-gold-500/40 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </>
  );
};

