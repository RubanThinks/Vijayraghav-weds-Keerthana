// Audio engine combining Web Audio API synthesized Carnatic/ambient instrumental
// with selectable styles: Auspicious Nadaswaram & Serene Bamboo Flute

export type MusicMode = 'flute' | 'nadaswaram';

class WeddingAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private timer: number | null = null;
  private currentMode: MusicMode = 'flute';
  private listeners: ((playing: boolean, mode: MusicMode) => void)[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public subscribe(fn: (playing: boolean, mode: MusicMode) => void) {
    this.listeners.push(fn);
    fn(this.isPlaying, this.currentMode);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.isPlaying, this.currentMode));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getMode(): MusicMode {
    return this.currentMode;
  }

  public setMode(mode: MusicMode): void {
    if (this.currentMode === mode) return;
    this.currentMode = mode;
    this.notify();
    if (this.isPlaying) {
      this.pause();
      setTimeout(() => this.play(), 200);
    }
  }

  // Melodic Carnatic / ambient wedding instrumental synthesizer
  private startSynthesizer() {
    if (!this.ctx || !this.masterGain) return;

    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.35, this.ctx.currentTime + 2.0);

    // Auspicious Tanpura Drone: Root C#3 (138.59 Hz), Fifth G#3 (207.65 Hz), Octave C#4 (277.18 Hz)
    const droneFreqs = [138.59, 207.65, 277.18, 554.37];
    droneFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.detune.setValueAtTime((idx % 2 === 0 ? 1 : -1) * (idx * 2 + 1), this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(950, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.06 / (idx + 1), this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
    });

    // Auspicious Raga Mohanam / Bilawal Wedding Notes (C#, D#, F, G#, A#, C#)
    const scale = [277.18, 311.13, 349.23, 415.30, 466.16, 554.37, 622.25, 698.46];
    let noteIdx = 0;

    const playMelodicNote = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;

      const freq = scale[noteIdx % scale.length];
      noteIdx = (noteIdx + Math.floor(Math.random() * 3) + 1) % scale.length;

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const noteGain = this.ctx.createGain();

      // Nadaswaram timbre: sawtooth/triangle with reed overtone; Flute: soft sine
      const isNadaswaram = this.currentMode === 'nadaswaram';
      osc.type = isNadaswaram ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Vibrato / Gamakam LFO
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(isNadaswaram ? 6.5 : 5.0, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(isNadaswaram ? 6 : 3.5, this.ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isNadaswaram ? 1800 : 1300, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      const duration = isNadaswaram ? 2.8 : 2.4;
      const peakVolume = isNadaswaram ? 0.07 : 0.09;

      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.linearRampToValueAtTime(peakVolume, now + (isNadaswaram ? 0.4 : 0.6));
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration + 0.1);
      lfo.stop(now + duration + 0.1);

      const delay = isNadaswaram ? (1400 + Math.random() * 1000) : (1800 + Math.random() * 1200);
      this.timer = window.setTimeout(playMelodicNote, delay);
    };

    this.timer = window.setTimeout(playMelodicNote, 700);
  }

  public async play(): Promise<void> {
    if (this.isPlaying) return;
    try {
      this.initContext();
      this.isPlaying = true;
      this.notify();
      this.startSynthesizer();
    } catch (err) {
      console.warn("Audio playback init note:", err);
    }
  }

  public pause(): void {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.notify();

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (this.ctx && this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
      setTimeout(() => {
        if (!this.isPlaying && this.ctx && this.ctx.state === 'running') {
          this.ctx.suspend();
        }
      }, 900);
    }
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
