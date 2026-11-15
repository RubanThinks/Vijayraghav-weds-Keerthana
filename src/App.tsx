import { useState, useEffect } from 'react';
import { IntroExperience } from './components/IntroExperience';
import { DivineHero } from './components/DivineHero';
import { HeartScratchReveal } from './components/HeartScratchReveal';
import { MeetCouple } from './components/MeetCouple';
import { WeddingCountdown } from './components/WeddingCountdown';
import { ReceptionSection } from './components/ReceptionSection';
import { WeddingCeremonySection } from './components/WeddingCeremonySection';
import { GuestGuide } from './components/GuestGuide';
import { FindYourWay } from './components/FindYourWay';
import { FinalGratitude } from './components/FinalGratitude';
import { Navigation } from './components/Navigation';
import { AudioController } from './components/AudioController';
import { useLenisGsap } from './hooks/useLenisGsap';
import { audioEngine } from './utils/audioEngine';

export function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Initialize smooth scroll & GSAP transitions
  useLenisGsap();

  // Play background wedding audio from the moment the site begins loading
  useEffect(() => {
    audioEngine.play();
  }, []);

  const handleReplayIntro = () => {
    setShowIntro(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-wine-950 text-ivory-100 overflow-x-hidden selection:bg-gold-500/30 selection:text-gold-200">
      {/* SECTION 01: Cinematic Intro Experience */}
      {showIntro && (
        <IntroExperience onComplete={() => setShowIntro(false)} />
      )}

      {/* Global Navigation Header & Drawer */}
      <Navigation onReplayIntro={handleReplayIntro} />

      {/* Persistent Audio Controller at Bottom-Left */}
      <AudioController />

      {/* Main Website Sections - Seamless vertical stacking with zero gaps */}
      <main className="relative z-10 flex flex-col m-0 p-0 gap-0 w-full overflow-hidden">
        {/* SECTION 02: Divine Welcome Hero with Lord Murugan Artwork */}
        <DivineHero />

        {/* SECTION 03: Scratch to Reveal the Wedding Date */}
        <HeartScratchReveal />

        {/* SECTION 04: Couple Introduction with Dedicated Stage Artwork */}
        <MeetCouple />

        {/* SECTION 05: Live Wedding Countdown with Hourglass Artwork */}
        <WeddingCountdown />

        {/* SECTION 06: Reception Invitation */}
        <ReceptionSection />

        {/* SECTION 07: Wedding Ceremony (Traditional Tamil Mandapam) */}
        <WeddingCeremonySection />

        {/* Guest Concierge: Travel & Stay */}
        <GuestGuide />

        {/* SECTION 08: Venue and Directions */}
        <FindYourWay />

        {/* SECTION 09: Gratitude & Emotional Closing */}
        <FinalGratitude />
      </main>
    </div>
  );
}

export default App;
