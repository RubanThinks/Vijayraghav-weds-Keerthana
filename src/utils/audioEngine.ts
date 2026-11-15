// Audio engine for Vijayraghav & Keerthana Wedding
// Plays high-quality background audio (vk-audio.mp3) with DOM attachment,
// continuous looping, unmuted autoplay, Web Audio unlock, and persistent capture-phase
// gesture unlocking across all mobile browsers (iOS Safari, Android Chrome).

class WeddingAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private userMuted: boolean = false;
  private listeners: ((playing: boolean) => void)[] = [];
  private hasInteractionListeners: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Initialize after DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initAudio());
      } else {
        this.initAudio();
      }
    }
  }

  private initAudio() {
    if (this.audio) return;
    try {
      // Attach audio element directly to the DOM for maximum mobile browser compatibility
      let audio = document.getElementById('vk-wedding-audio') as HTMLAudioElement;
      if (!audio) {
        audio = document.createElement('audio');
        audio.id = 'vk-wedding-audio';
        audio.src = '/assets/audio/vk-audio.mp3';
        audio.loop = true;
        audio.preload = 'auto';
        audio.setAttribute('playsinline', 'true');
        audio.setAttribute('webkit-playsinline', 'true');
        audio.style.display = 'none';
        document.body.appendChild(audio);
      }
      this.audio = audio;
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

      // Attempt immediate unmuted autoplay on load
      this.attemptAutoPlay();

      // Setup interaction unlock fallback for mobile Chrome/Safari
      this.setupInteractionUnlock();

      // Additional trigger attempts on browser lifecycle events
      window.addEventListener('pageshow', () => this.attemptAutoPlay(), { passive: true });
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && !this.userMuted && !this.isPlaying) {
          this.attemptAutoPlay();
        }
      });
    } catch (err) {
      console.warn("Audio initialization notice:", err);
    }
  }

  private unlockAudioContext() {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch {
      // Ignore if not supported
    }
  }

  private attemptAutoPlay() {
    if (!this.audio || this.userMuted || this.isPlaying) return;
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.isPlaying = true;
          this.notify();
        })
        .catch(() => {
          this.isPlaying = false;
          this.notify();
        });
    }
  }

  private setupInteractionUnlock() {
    if (this.hasInteractionListeners || typeof window === 'undefined') return;
    this.hasInteractionListeners = true;

    const events = [
      'touchstart',
      'touchend',
      'click',
      'pointerdown',
      'pointerup',
      'scroll'
    ];

    const unlockHandler = async () => {
      if (this.isPlaying || this.userMuted) {
        if (this.isPlaying) {
          cleanup();
        }
        return;
      }

      this.unlockAudioContext();

      if (this.audio) {
        try {
          await this.audio.play();
          this.isPlaying = true;
          this.notify();
          cleanup();
        } catch {
          // Keep listeners active until audio is confirmed playing
        }
      }
    };

    const cleanup = () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, unlockHandler, { capture: true });
        document.removeEventListener(evt, unlockHandler, { capture: true });
      });
      this.hasInteractionListeners = false;
    };

    events.forEach((evt) => {
      window.addEventListener(evt, unlockHandler, { capture: true, passive: true });
      document.addEventListener(evt, unlockHandler, { capture: true, passive: true });
    });
  }

  public subscribe(fn: (playing: boolean) => void) {
    this.listeners.push(fn);
    fn(this.isPlaying);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.isPlaying));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public async play(): Promise<void> {
    this.userMuted = false;
    this.unlockAudioContext();
    if (!this.audio) {
      this.initAudio();
    }
    if (this.audio) {
      try {
        await this.audio.play();
        this.isPlaying = true;
        this.notify();
      } catch (err) {
        console.warn("Play queued for first interaction:", err);
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
