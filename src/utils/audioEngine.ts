// Audio engine for Vijayraghav & Keerthana Wedding
// Plays high-quality background audio (vk-audio.mp3) with seamless looping,
// unmuted autoplay, and instant first-gesture unlock fallback.

class WeddingAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private userMuted: boolean = false;
  private listeners: ((playing: boolean) => void)[] = [];
  private hasInteractionListener: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudio();
    }
  }

  private initAudio() {
    if (this.audio) return;
    try {
      this.audio = new Audio('/assets/audio/vk-audio.mp3');
      this.audio.loop = true;
      this.audio.preload = 'auto';
      this.audio.volume = 0.85;

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      this.audio.addEventListener('ended', () => {
        if (!this.userMuted && this.audio) {
          this.audio.play().catch(() => {});
        }
      });

      // Attempt immediate autoplay right away on load
      this.attemptAutoPlay();

      // Ensure that on the very first touch/click/interaction anywhere on the screen,
      // the audio begins playing if the initial autoplay was blocked by the browser.
      this.setupInteractionUnlock();
    } catch (err) {
      console.warn("Audio initialization notice:", err);
    }
  }

  private attemptAutoPlay() {
    if (!this.audio || this.userMuted) return;
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.notify();
        })
        .catch(() => {
          // Handled gracefully via setupInteractionUnlock
          this.isPlaying = false;
          this.notify();
        });
    }
  }

  private setupInteractionUnlock() {
    if (this.hasInteractionListener || typeof window === 'undefined') return;
    this.hasInteractionListener = true;

    const unlock = () => {
      if (!this.userMuted && this.audio && this.audio.paused) {
        this.audio.play().catch(() => {});
      }
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      this.hasInteractionListener = false;
    };

    window.addEventListener('pointerdown', unlock, { once: true, passive: true });
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
    window.addEventListener('click', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true, passive: true });
  }

  public subscribe(fn: (playing: boolean) => void) {
    this.listeners.push(fn);
    fn(this.isPlaying);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.isPlaying));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public async play(): Promise<void> {
    this.userMuted = false;
    if (!this.audio) {
      this.initAudio();
    }
    if (this.audio) {
      try {
        await this.audio.play();
        this.isPlaying = true;
        this.notify();
      } catch (err) {
        console.warn("Play deferred until user gesture:", err);
      }
    }
  }

  public pause(): void {
    this.userMuted = true;
    if (this.audio) {
      this.audio.pause();
    }
    this.isPlaying = false;
    this.notify();
  }

  public toggle(): void {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  // Play celebration sparkle chime when heart is scratched
  public playCelebrationChime(): void {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const chimeCtx = new AudioCtx();
      const chimeFreqs = [554.37, 698.46, 830.61, 1108.73, 1396.91];

      chimeFreqs.forEach((freq, i) => {
        const osc = chimeCtx.createOscillator();
        const gain = chimeCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, chimeCtx.currentTime + i * 0.1);

        const startTime = chimeCtx.currentTime + i * 0.1;
        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.2);

        osc.connect(gain);
        gain.connect(chimeCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.3);
      });
    } catch {
      // Ignored if sound blocked
    }
  }
}

export const audioEngine = new WeddingAudioEngine();
