import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Calendar, Hand, Share2 } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  rotation: number;
  vRot: number;
}

export const HeartScratchReveal: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const heartContainerRef = useRef<HTMLDivElement | null>(null);

  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [scratchPercent, setScratchPercent] = useState<number>(0);
  const [hasStartedScratching, setHasStartedScratching] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Responsive device check
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Heart curve path helper matching the exact uploaded heart dimensions
  const drawHeartPath = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.beginPath();
    // Top cleft center notch
    ctx.moveTo(w * 0.5, h * 0.155);

    // Left lobe top curve (reaches peak at x ~ 0.23, y ~ 0.00)
    ctx.bezierCurveTo(w * 0.44, h * 0.02, w * 0.30, 0, w * 0.23, 0);
    ctx.bezierCurveTo(w * 0.10, 0, 0, h * 0.10, 0, h * 0.30);

    // Left flank down to bottom tip (reaches tip at x ~ 0.50, y ~ 1.00)
    ctx.bezierCurveTo(0, h * 0.52, w * 0.20, h * 0.78, w * 0.50, h);

    // Right flank up from bottom tip
    ctx.bezierCurveTo(w * 0.80, h * 0.78, w, h * 0.52, w, h * 0.30);

    // Right lobe top curve (reaches peak at x ~ 0.77, y ~ 0.00)
    ctx.bezierCurveTo(w, h * 0.10, w * 0.90, 0, w * 0.77, 0);
    ctx.bezierCurveTo(w * 0.70, 0, w * 0.56, h * 0.02, w * 0.5, h * 0.155);

    ctx.closePath();
  };

  // Generate realistic 3D shining golden glitter foil texture
  const renderGlitterTexture = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    drawHeartPath(ctx, w, h);
    ctx.clip();

    // 1. Rich 24K Shining Gold Foil Base Gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#fffbe6');
    grad.addColorStop(0.15, '#fae188');
    grad.addColorStop(0.35, '#d4af37');
    grad.addColorStop(0.55, '#fff0ba');
    grad.addColorStop(0.75, '#c99726');
    grad.addColorStop(0.9, '#f6df99');
    grad.addColorStop(1, '#946e19');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 2. High-Specular Metallic Reflection Beams (Sweeping light bands)
    const sheen1 = ctx.createLinearGradient(0, 0, w * 0.8, h);
    sheen1.addColorStop(0, 'rgba(255, 255, 255, 0)');
    sheen1.addColorStop(0.35, 'rgba(255, 255, 255, 0.55)');
    sheen1.addColorStop(0.45, 'rgba(255, 255, 255, 0.85)');
    sheen1.addColorStop(0.55, 'rgba(255, 255, 255, 0.55)');
    sheen1.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sheen1;
    ctx.fillRect(0, 0, w, h);

    const sheen2 = ctx.createLinearGradient(w * 0.3, 0, w, h * 0.7);
    sheen2.addColorStop(0, 'rgba(255, 250, 220, 0)');
    sheen2.addColorStop(0.4, 'rgba(255, 250, 220, 0.45)');
    sheen2.addColorStop(0.5, 'rgba(255, 255, 255, 0.75)');
    sheen2.addColorStop(0.6, 'rgba(255, 250, 220, 0.45)');
    sheen2.addColorStop(1, 'rgba(255, 250, 220, 0)');
    ctx.fillStyle = sheen2;
    ctx.fillRect(0, 0, w, h);

    // 3. Dense Sparkling Gold & Champagne Crystals (Simulating physical 3D glitter)
    const crystalCount = Math.floor((w * h) / 24);
    const glitterColors = [
      '#ffffff',
      '#fffdf0',
      '#fff2b2',
      '#ffe57f',
      '#ffd700',
      '#d4af37',
      '#e5c158',
      '#f9e076',
      '#b8860b',
    ];

    for (let i = 0; i < crystalCount; i++) {
      const px = Math.random() * w;
      const py = Math.random() * h;
      const size = Math.random() * 2.4 + 0.6;
      const color = glitterColors[Math.floor(Math.random() * glitterColors.length)];
      const alpha = Math.random() * 0.85 + 0.15;

      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;

      if (Math.random() > 0.90) {
        // 4-point diamond star sparkle
        const r = size * 1.6;
        ctx.beginPath();
        ctx.moveTo(px, py - r);
        ctx.lineTo(px + r * 0.3, py - r * 0.3);
        ctx.lineTo(px + r, py);
        ctx.lineTo(px + r * 0.3, py + r * 0.3);
        ctx.lineTo(px, py + r);
        ctx.lineTo(px - r * 0.3, py + r * 0.3);
        ctx.lineTo(px - r, py);
        ctx.lineTo(px - r * 0.3, py - r * 0.3);
        ctx.closePath();
        ctx.fill();
      } else if (Math.random() > 0.70) {
        // Diamond crystal
        ctx.beginPath();
        ctx.moveTo(px, py - size);
        ctx.lineTo(px + size, py);
        ctx.lineTo(px, py + size);
        ctx.lineTo(px - size, py);
        ctx.closePath();
        ctx.fill();
      } else {
        // Micro glitter grain
        ctx.fillRect(px, py, size, size);
      }
    }
    ctx.globalAlpha = 1.0;

    // 4. Embossed Inner Gold Bevel along Heart Perimeter for seamless physical fit
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = 'rgba(255, 235, 140, 0.75)';
    ctx.stroke();

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(180, 130, 20, 0.6)';
    ctx.stroke();

    ctx.restore();
  }, []);

  // Initialize canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = heartContainerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);

    if (w <= 0 || h <= 0) return;

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, w, h);
    renderGlitterTexture(ctx, w, h);
  }, [renderGlitterTexture]);

  useEffect(() => {
    initCanvas();
    const timer = setTimeout(initCanvas, 300);
    return () => clearTimeout(timer);
  }, [initCanvas, isDesktop]);

  // Outward explosion of tiny glittering crystals animation
  const triggerOutwardGlitterExplosion = useCallback(() => {
    const pCanvas = particleCanvasRef.current;
    const container = heartContainerRef.current;
    if (!pCanvas || !container) return;

    const rect = container.getBoundingClientRect();
    const w = (pCanvas.width = window.innerWidth);
    const h = (pCanvas.height = window.innerHeight);
    const ctx = pCanvas.getContext('2d');
    if (!ctx) return;

    const heartCenterX = rect.left + rect.width / 2;
    const heartCenterY = rect.top + rect.height * 0.48;

    const particleCount = 140;
    const particles: Particle[] = [];
    const colors = ['#fffbe6', '#ffd700', '#d4af37', '#f4e4b5', '#ffeaa7', '#ffffff'];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2.5;
      particles.push({
        x: heartCenterX + (Math.random() - 0.5) * rect.width * 0.4,
        y: heartCenterY + (Math.random() - 0.5) * rect.height * 0.4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        size: Math.random() * 3.5 + 1.2,
        alpha: 1.0,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.15,
      });
    }

    const startTime = performance.now();

    const animateParticles = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.vy += 0.04; // Gentle gravity
        p.rotation += p.vRot;
        p.alpha = Math.max(0, 1 - elapsed / 1800);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        // Sparkle diamond shape
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.lineTo(p.size * 0.8, 0);
        ctx.lineTo(0, p.size);
        ctx.lineTo(-p.size * 0.8, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      });

      if (elapsed < 1900) {
        requestAnimationFrame(animateParticles);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    };

    requestAnimationFrame(animateParticles);
  }, []);

  // Completion trigger when ~60% scratched
  const handleCompletion = useCallback(() => {
    setIsRevealed(true);
    audioEngine.playCelebrationChime();
    triggerOutwardGlitterExplosion();

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.52 },
        colors: ['#ffd700', '#d4af37', '#fff8db', '#faf0d2'],
      });
    } catch {
      // Ignore
    }
  }, [triggerOutwardGlitterExplosion]);

  // Pixel scratch ratio calculation
  const checkScratchRatio = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let erasedCount = 0;
      let totalCount = 0;

      // Sample every 16th pixel for real-time mobile performance
      for (let i = 3; i < data.length; i += 16) {
        if (data[i] !== undefined) {
          totalCount++;
          if (data[i] === 0) {
            erasedCount++;
          }
        }
      }

      const ratio = Math.round((erasedCount / totalCount) * 100);
      setScratchPercent(ratio);

      // Trigger completion at ~58% - 60%
      if (ratio >= 58 && !isRevealed) {
        handleCompletion();
      }
    } catch {
      // Ignore
    }
  }, [isRevealed, handleCompletion]);

  // Scratch action using Pointer Events with smooth stroke
  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    // Smooth rounded scratch circle (radius adjusted for comfortable finger & mouse)
    const brushRadius = isDesktop ? 26 : 22;
    ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const isScratchingRef = useRef<boolean>(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isRevealed) return;
    isScratchingRef.current = true;
    setHasStartedScratching(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    scratchAt(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratchingRef.current || isRevealed) return;
    scratchAt(e.clientX, e.clientY);
    checkScratchRatio();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isScratchingRef.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
    checkScratchRatio();
  };

  // Google Calendar URL generator
  const createGoogleCalendarUrl = () => {
    const title = encodeURIComponent("Wedding Celebration: Vijayraghav weds Keerthana");
    const details = encodeURIComponent(
      "Wedding Celebration of Vijayraghav & Keerthana at Shri Kamatchi Mahal, Karur, Tamil Nadu. Reception on 12 Dec (6-8 PM), Sacred Muhurtham on 13 Dec (4:30-6:00 AM)."
    );
    const location = encodeURIComponent("Shri Kamatchi Mahal, Karur, Tamil Nadu, India");
    const dates = "20261212T123000Z/20261213T003000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  const copyShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <section
      id="scratch-reveal"
      className="screen-section relative overflow-hidden bg-wine-950 flex items-center justify-center select-none"
    >
      {/* Background Particle Canvas for Golden Explosion */}
      <canvas
        ref={particleCanvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      {/* Card Viewport Frame: 100% Full Viewport on Mobile (Zero Gaps), 16:9 on Desktop */}
      <div className="relative w-full h-[100dvh] min-h-[100dvh] md:min-h-0 md:h-[min(100dvh,calc(100vw*9/16))] md:w-[min(100vw,calc(100dvh*16/9))] md:aspect-[16/9] flex items-center justify-center overflow-hidden select-none shadow-2xl">
        
        {/* Exact Uploaded Images (Mobile & Desktop) - Raw, Normal Unzoomed Size */}
        <picture className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
          <source media="(max-width: 767px)" srcSet="/assets/backgrounds/scratch-mobile.jpg" />
          <img
            src="/assets/backgrounds/scratch-desktop.jpg"
            alt="Luxury Wedding Scratch Card Background"
            className="w-full h-full object-fill md:object-fill object-center"
            loading="eager"
          />
        </picture>

        {/* Interaction Instruction Above the Heart */}
        <div className="absolute top-[6%] sm:top-[8%] md:top-[3%] left-0 right-0 z-20 text-center px-4 pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-wine-950/85 border border-gold-400/35 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
            <span className="font-cinzel text-[11px] sm:text-xs md:text-sm tracking-[0.25em] uppercase text-gold-200 font-semibold text-shadow-deep">
              Something beautiful is waiting for you...
            </span>
          </div>
        </div>

        {/* CALIBRATED HEART CONTAINER - Mathematically Aligned with the Ivory Heart in Both Images */}
        <div
          ref={heartContainerRef}
          className={`absolute z-10 flex items-center justify-center ${
            isDesktop
              ? 'left-[23.83%] top-[12.67%] w-[51.95%] h-[73.61%]'
              : 'left-[9.20%] top-[34.08%] w-[81.77%] h-[38.96%]'
          }`}
        >
          {/* UNDERNEATH LAYER: Pure Wedding Date & Muhurtham Timing in Bold Burgundy */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 sm:p-5 md:p-6 z-0 pointer-events-none select-none">
            {/* Wedding Date (Day 13) */}
            <span className="font-cinzel font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-[#580827] tracking-tight drop-shadow-[0_2px_4px_rgba(88,8,39,0.3)] leading-none">
              13
            </span>

            {/* Month & Year */}
            <span className="font-cinzel font-black text-lg sm:text-2xl md:text-3xl lg:text-4xl text-[#6b0f34] tracking-[0.26em] sm:tracking-[0.3em] block drop-shadow-[0_1px_3px_rgba(107,15,52,0.25)] uppercase mt-2 sm:mt-3">
              DECEMBER 2026
            </span>

            {/* Refined Burgundy & Gold Ornate Separator */}
            <div className="flex items-center justify-center gap-2 my-2 sm:my-3 w-32 sm:w-48 md:w-56">
              <span className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent via-[#800d3d] to-transparent" />
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rotate-45 bg-[#b8860b] shadow-sm" />
              <span className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent via-[#800d3d] to-transparent" />
            </div>

            {/* Muhurtham Timing Only */}
            <div className="text-center">
              <span className="font-serif italic font-bold text-sm sm:text-lg md:text-xl lg:text-2xl text-[#580827] tracking-wide block drop-shadow-sm">
                Muhurtham: 4:30 AM – 6:00 AM
              </span>
            </div>
          </div>

          {/* TOP INTERACTIVE SCRATCH CANVAS (Metallic Champagne Gold Glitter Foil) */}
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            style={{ touchAction: 'none' }}
            className={`absolute inset-0 w-full h-full cursor-pointer z-10 transition-opacity duration-700 ${
              isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          />

          {/* Animated Hand Gesture Indicator (Fades out when scratching begins) */}
          {!hasStartedScratching && !isRevealed && (
            <div className="absolute z-20 pointer-events-none flex flex-col items-center justify-center animate-pulse">
              <div className="p-2.5 rounded-full bg-wine-950/85 border border-gold-400/50 shadow-2xl animate-[float_2s_ease-in-out_infinite]">
                <Hand className="w-5 h-5 text-gold-300" />
              </div>
              <span className="font-sans text-[10px] uppercase tracking-widest text-gold-200 bg-wine-950/90 px-2 py-0.5 rounded-full border border-gold-400/30 mt-1 shadow">
                Swipe Here
              </span>
            </div>
          )}
        </div>

        {/* Interaction Instruction Below the Heart */}
        <div className="absolute bottom-[8%] md:bottom-[4%] left-0 right-0 z-20 text-center px-4">
          {!isRevealed ? (
            <div className="inline-flex flex-col items-center gap-1.5">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-wine-950/85 border border-gold-400/35 shadow-lg">
                <span className="font-serif italic text-xs sm:text-sm text-gold-200 tracking-wide text-shadow-deep">
                  Scratch to discover our special date
                </span>
                <span className="text-[10px] font-sans text-gold-300/80 bg-wine-900 px-2 py-0.5 rounded-full border border-gold-500/25">
                  {scratchPercent}%
                </span>
              </div>

              {/* Instant Reveal Option for Accessibility */}
              <button
                onClick={handleCompletion}
                className="text-[10px] font-sans text-gold-300/70 hover:text-gold-100 underline transition-colors"
              >
                Reveal special date directly
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={createGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-sans text-xs font-semibold tracking-wider uppercase transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Add to Calendar</span>
              </a>

              <button
                onClick={copyShareLink}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-wine-900/90 hover:bg-wine-850 text-gold-200 border border-gold-500/40 font-sans text-xs font-semibold tracking-wider uppercase transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5 text-gold-400" />
                <span>{copiedLink ? "Link Copied!" : "Share Date"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
