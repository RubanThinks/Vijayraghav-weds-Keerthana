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

interface TwinkleStar {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speed: number;
  phase: number;
  maxAlpha: number;
  rays: number;
}

interface ScratchDust {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

export const HeartScratchReveal: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const heartContainerRef = useRef<HTMLDivElement | null>(null);

  // In-memory offscreen canvases
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const foilTextureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [scratchPercent, setScratchPercent] = useState<number>(0);
  const [hasStartedScratching, setHasStartedScratching] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Active dynamic visual effects
  const twinklesRef = useRef<TwinkleStar[]>([]);
  const scratchDustRef = useRef<ScratchDust[]>([]);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const isScratchingRef = useRef<boolean>(false);

  // Responsive device check
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Heart curve path matching the exact uploaded heart dimensions
  const createHeartPath = (w: number, h: number): Path2D => {
    const path = new Path2D();
    // Top cleft center notch
    path.moveTo(w * 0.5, h * 0.155);

    // Left lobe top curve
    path.bezierCurveTo(w * 0.44, h * 0.02, w * 0.30, 0, w * 0.23, 0);
    path.bezierCurveTo(w * 0.10, 0, 0, h * 0.10, 0, h * 0.30);

    // Left flank down to bottom tip
    path.bezierCurveTo(0, h * 0.52, w * 0.20, h * 0.78, w * 0.50, h);

    // Right flank up from bottom tip
    path.bezierCurveTo(w * 0.80, h * 0.78, w, h * 0.52, w, h * 0.30);

    // Right lobe top curve
    path.bezierCurveTo(w, h * 0.10, w * 0.90, 0, w * 0.77, 0);
    path.bezierCurveTo(w * 0.70, 0, w * 0.56, h * 0.02, w * 0.5, h * 0.155);

    path.closePath();
    return path;
  };

  // Generate hyper-realistic physical gold glitter foil texture (crushed metallic flakes + faceted bevels)
  const buildRealisticGlitterFoil = (w: number, h: number): HTMLCanvasElement => {
    const foilCanvas = document.createElement('canvas');
    foilCanvas.width = w;
    foilCanvas.height = h;
    const ctx = foilCanvas.getContext('2d');
    if (!ctx) return foilCanvas;

    const heartPath = createHeartPath(w, h);

    ctx.save();
    ctx.clip(heartPath);

    // 1. Rich Warm Metallic Gold Base
    const baseGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, w * 0.1, w * 0.5, h * 0.5, w * 0.75);
    baseGrad.addColorStop(0, '#f9e28f');
    baseGrad.addColorStop(0.35, '#d4af37');
    baseGrad.addColorStop(0.7, '#a67c1e');
    baseGrad.addColorStop(1, '#684507');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. Multi-Tier Micro-Faceted Glitter Flakes (Simulating genuine crushed foil particles)
    const area = w * h;
    const coarseCount = Math.floor(area / 18);
    const fineCount = Math.floor(area / 8);
    const specularCount = Math.floor(area / 28);

    // Palette of genuine physical gold leaf flakes
    const deepGoldTones = ['#8c6013', '#a8751a', '#b8860b', '#c49323'];
    const midGoldTones = ['#ffd700', '#fad02c', '#f7d046', '#e6ba29', '#ffdf6d'];
    const highlightTones = ['#ffffff', '#fffbe6', '#fff6cc', '#fffae8'];

    // Layer A: Under-layer deep bronze/amber shadow flakes
    for (let i = 0; i < coarseCount; i++) {
      const fx = Math.random() * w;
      const fy = Math.random() * h;
      const size = Math.random() * 2.2 + 1.2;
      ctx.fillStyle = deepGoldTones[Math.floor(Math.random() * deepGoldTones.length)];
      ctx.globalAlpha = Math.random() * 0.6 + 0.3;
      ctx.beginPath();
      ctx.arc(fx, fy, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Layer B: Dense 24K bright faceted flakes with micro bevels (light & shadow per flake)
    for (let i = 0; i < fineCount; i++) {
      const fx = Math.random() * w;
      const fy = Math.random() * h;
      const size = Math.random() * 2.6 + 0.8;
      const color = midGoldTones[Math.floor(Math.random() * midGoldTones.length)];

      // Subtle shadow edge for 3D physical grain
      ctx.fillStyle = 'rgba(70, 40, 5, 0.45)';
      ctx.globalAlpha = 0.4;
      ctx.fillRect(fx + 0.6, fy + 0.6, size, size);

      // Main metallic flake
      ctx.fillStyle = color;
      ctx.globalAlpha = Math.random() * 0.75 + 0.25;

      if (Math.random() > 0.45) {
        // Hexagonal / faceted flake
        ctx.beginPath();
        const rot = Math.random() * Math.PI;
        for (let p = 0; p < 6; p++) {
          const ang = rot + (p * Math.PI) / 3;
          const px = fx + Math.cos(ang) * size;
          const py = fy + Math.sin(ang) * size;
          if (p === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(fx, fy, size, size);
      }
    }

    // Layer C: High-specular diamond crystals that catch light
    for (let i = 0; i < specularCount; i++) {
      const fx = Math.random() * w;
      const fy = Math.random() * h;
      const size = Math.random() * 1.8 + 0.6;
      ctx.fillStyle = highlightTones[Math.floor(Math.random() * highlightTones.length)];
      ctx.globalAlpha = Math.random() * 0.85 + 0.15;
      ctx.beginPath();
      ctx.arc(fx, fy, size * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1.0;

    // 3. Stamped Gold Foil Border Rim (Physical beveled gold card edge)
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(255, 240, 160, 0.85)';
    ctx.stroke(heartPath);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(160, 115, 20, 0.7)';
    ctx.stroke(heartPath);

    ctx.restore();
    return foilCanvas;
  };

  // Spawn twinkling stars strictly within the heart shape
  const initTwinkles = (w: number, h: number, heartPath: Path2D) => {
    const testCanvas = document.createElement('canvas');
    testCanvas.width = w;
    testCanvas.height = h;
    const testCtx = testCanvas.getContext('2d');
    if (!testCtx) return;

    const stars: TwinkleStar[] = [];
    const targetCount = isDesktop ? 32 : 22;

    for (let attempts = 0; attempts < 400 && stars.length < targetCount; attempts++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      if (testCtx.isPointInPath(heartPath, x, y)) {
        stars.push({
          x,
          y,
          size: Math.random() * 4.5 + 2.5,
          alpha: Math.random(),
          speed: Math.random() * 0.045 + 0.02,
          phase: Math.random() * Math.PI * 2,
          maxAlpha: Math.random() * 0.45 + 0.55,
          rays: Math.random() > 0.3 ? 4 : 6,
        });
      }
    }

    twinklesRef.current = stars;
  };

  // Draw an optical flare / starburst glint
  const drawGlint = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    alpha: number,
    rays: number
  ) => {
    if (alpha <= 0.02) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = alpha;

    // Center radiant bloom
    const radial = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.5);
    radial.addColorStop(0, 'rgba(255, 255, 255, 1)');
    radial.addColorStop(0.35, 'rgba(255, 240, 180, 0.7)');
    radial.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Sharp cross diffraction rays
    ctx.fillStyle = '#ffffff';
    for (let r = 0; r < rays; r++) {
      const angle = (r * Math.PI) / (rays / 2);
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(-size * 2.8, 0);
      ctx.lineTo(0, -size * 0.35);
      ctx.lineTo(size * 2.8, 0);
      ctx.lineTo(0, size * 0.35);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  };

  // Outward explosion of tiny glittering crystals on completion
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

    const particleCount = 160;
    const particles: Particle[] = [];
    const colors = ['#fffbe6', '#ffd700', '#d4af37', '#f4e4b5', '#ffeaa7', '#ffffff'];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6.5 + 2.5;
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
  }, [isDesktop]);

  // Completion trigger when ~58% scratched
  const handleCompletion = useCallback(() => {
    setIsRevealed(true);
    audioEngine.playCelebrationChime();
    triggerOutwardGlitterExplosion();

    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.52 },
        colors: ['#ffd700', '#d4af37', '#fff8db', '#faf0d2'],
      });
    } catch {
      // Ignore
    }
  }, [triggerOutwardGlitterExplosion]);

  // Calculate pixel scratch ratio from the offscreen mask
  const checkScratchRatio = useCallback(() => {
    const mask = maskCanvasRef.current;
    if (!mask || isRevealed) return;
    const ctx = mask.getContext('2d');
    if (!ctx) return;

    try {
      const imgData = ctx.getImageData(0, 0, mask.width, mask.height);
      const data = imgData.data;
      let erasedCount = 0;
      let totalCount = 0;

      // Sample every 16th pixel for mobile performance
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

      if (ratio >= 58 && !isRevealed) {
        handleCompletion();
      }
    } catch {
      // Ignore
    }
  }, [isRevealed, handleCompletion]);

  // Emit sparkling gold dust particles while scratching
  const emitScratchDust = (x: number, y: number) => {
    const count = 3;
    const colors = ['#fffdf0', '#ffd700', '#fae188', '#d4af37'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.5 + 0.8;
      scratchDustRef.current.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        size: Math.random() * 2.2 + 1.0,
        alpha: 1.0,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: Math.floor(Math.random() * 15 + 15),
      });
    }
  };

  // Erase scratch line on the offscreen mask with smooth interpolation
  const eraseOnMask = (x1: number, y1: number, x2: number, y2: number) => {
    const mask = maskCanvasRef.current;
    if (!mask) return;
    const ctx = mask.getContext('2d');
    if (!ctx) return;

    const brushRadius = isDesktop ? 26 : 22;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brushRadius * 2;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x2, y2, brushRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  // Initialize both offscreen canvases and start the 60fps shimmer animation loop
  const initCanvases = useCallback(() => {
    const canvas = canvasRef.current;
    const container = heartContainerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const w = Math.round(rect.width);
    const h = Math.round(rect.height);
    if (w <= 0 || h <= 0) return;

    canvas.width = w;
    canvas.height = h;

    // 1. Offscreen Scratch Mask (starts filled with solid white)
    const mask = document.createElement('canvas');
    mask.width = w;
    mask.height = h;
    const maskCtx = mask.getContext('2d');
    if (maskCtx) {
      const heartPath = createHeartPath(w, h);
      maskCtx.fillStyle = '#ffffff';
      maskCtx.fill(heartPath);
    }
    maskCanvasRef.current = mask;

    // 2. Offscreen High-Density Golden Glitter Foil Texture
    foilTextureCanvasRef.current = buildRealisticGlitterFoil(w, h);

    // 3. Setup scintillating twinkles inside the heart
    const heartPath = createHeartPath(w, h);
    initTwinkles(w, h, heartPath);

    // Cancel any existing animation frame
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    // 60fps Shimmer, Caustic Sheen & Twinkle Render Loop
    const renderLoop = (now: number) => {
      const ctx = canvas.getContext('2d');
      const maskCanvas = maskCanvasRef.current;
      const foilCanvas = foilTextureCanvasRef.current;

      if (!ctx || !maskCanvas || !foilCanvas) return;

      ctx.clearRect(0, 0, w, h);

      // Step A: Draw the Base High-Resolution Glitter Foil
      ctx.drawImage(foilCanvas, 0, 0);

      // Step B: Sweeping Specular Light Caustic Sheen (Continuous luxury gleam across facets)
      ctx.save();
      ctx.clip(heartPath);

      const sheenProgress = ((now * 0.00035) % 1.6) - 0.3; // Cycles across heart
      const sheenX = sheenProgress * w * 2.2 - w * 0.6;
      const sheenY = sheenProgress * h * 1.5 - h * 0.2;
      const sheenWidth = w * 0.6;

      const sheenGrad = ctx.createLinearGradient(sheenX, sheenY, sheenX + sheenWidth, sheenY + sheenWidth * 0.8);
      sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      sheenGrad.addColorStop(0.35, 'rgba(255, 250, 215, 0.45)');
      sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
      sheenGrad.addColorStop(0.65, 'rgba(255, 250, 215, 0.45)');
      sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.globalCompositeOperation = 'color-dodge';
      ctx.fillStyle = sheenGrad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Step C: Scintillating Optical Glints (Twinkles on individual flakes)
      twinklesRef.current.forEach((star) => {
        star.phase += star.speed;
        const currentAlpha = Math.sin(star.phase) * star.maxAlpha;
        if (currentAlpha > 0.05) {
          drawGlint(ctx, star.x, star.y, star.size, currentAlpha, star.rays);
        }
      });

      // Step D: Active Scratch Dust Flakes (particles that fly off while scratching)
      const dust = scratchDustRef.current;
      for (let i = dust.length - 1; i >= 0; i--) {
        const d = dust[i];
        d.x += d.vx;
        d.y += d.vy;
        d.vy += 0.05;
        d.vx *= 0.96;
        d.life++;
        d.alpha = 1 - d.life / d.maxLife;

        ctx.save();
        ctx.globalAlpha = Math.max(0, d.alpha);
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (d.life >= d.maxLife) {
          dust.splice(i, 1);
        }
      }

      // Step E: Composite the Scratch Mask to Reveal Underneath
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(maskCanvas, 0, 0);
      ctx.globalCompositeOperation = 'source-over';

      if (!isRevealed) {
        animFrameRef.current = requestAnimationFrame(renderLoop);
      }
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);
  }, [isRevealed, isDesktop]);

  useEffect(() => {
    initCanvases();
    const timer = setTimeout(initCanvases, 250);
    return () => {
      clearTimeout(timer);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [initCanvases, isDesktop]);

  // Handle pointer scratching gestures
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isRevealed) return;
    isScratchingRef.current = true;
    setHasStartedScratching(true);
    e.currentTarget.setPointerCapture(e.pointerId);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    lastPointRef.current = { x, y };
    eraseOnMask(x, y, x, y);
    emitScratchDust(x, y);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratchingRef.current || isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    if (lastPointRef.current) {
      eraseOnMask(lastPointRef.current.x, lastPointRef.current.y, x, y);
      emitScratchDust(x, y);
    }
    lastPointRef.current = { x, y };
    checkScratchRatio();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isScratchingRef.current = false;
    lastPointRef.current = null;
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

          {/* TOP INTERACTIVE SCRATCH CANVAS (Authentic Physical Gold Glitter Foil with Shimmer & Twinkles) */}
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

export default HeartScratchReveal;
