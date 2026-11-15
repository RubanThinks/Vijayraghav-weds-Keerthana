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

interface GlitterSparkle {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  phase: number;
  maxBrightness: number;
  hasStarFlare: boolean;
  flareRays: number;
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

  // In-memory offscreen buffers
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const foilTextureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [scratchPercent, setScratchPercent] = useState<number>(0);
  const [hasStartedScratching, setHasStartedScratching] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Active particle lists & pointers
  const glitterSparklesRef = useRef<GlitterSparkle[]>([]);
  const scratchDustRef = useRef<ScratchDust[]>([]);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const isScratchingRef = useRef<boolean>(false);
  const prefersReducedMotionRef = useRef<boolean>(false);

  // Responsive device check & accessibility motion preference
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);

    if (typeof window !== 'undefined') {
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotionRef.current = motionQuery.matches;
      const motionListener = (e: MediaQueryListEvent) => {
        prefersReducedMotionRef.current = e.matches;
      };
      motionQuery.addEventListener('change', motionListener);
      return () => {
        window.removeEventListener('resize', handleResize);
        motionQuery.removeEventListener('change', motionListener);
      };
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Precise mathematical heart path matching the uploaded card artwork
  const createHeartPath = (w: number, h: number): Path2D => {
    const path = new Path2D();
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

  // Generate ultra-dense physical gold glitter foil base (25,000+ faceted metallic flakes with 3D micro-depth)
  const buildRealisticGlitterFoil = (w: number, h: number): HTMLCanvasElement => {
    const foilCanvas = document.createElement('canvas');
    foilCanvas.width = w;
    foilCanvas.height = h;
    const ctx = foilCanvas.getContext('2d');
    if (!ctx) return foilCanvas;

    const heartPath = createHeartPath(w, h);

    ctx.save();
    ctx.clip(heartPath);

    // 1. Warm 24K Radiant Gold Metallic Base
    const baseGrad = ctx.createRadialGradient(w * 0.5, h * 0.45, w * 0.1, w * 0.5, h * 0.5, w * 0.75);
    baseGrad.addColorStop(0, '#fae596');
    baseGrad.addColorStop(0.35, '#d4af37');
    baseGrad.addColorStop(0.7, '#a87e22');
    baseGrad.addColorStop(1, '#664306');
    ctx.fillStyle = baseGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. High-Density Micro-Faceted Glitter Flakes (Layered for physical 3D glitter paper appearance)
    const area = w * h;
    const coarseCount = Math.floor(area / 16);
    const fineCount = Math.floor(area / 7);
    const specularCount = Math.floor(area / 24);

    const shadowGold = ['#7c530e', '#966714', '#af7d1c', '#c29026'];
    const vibrantGold = ['#ffd700', '#fad02c', '#f5ce3b', '#e6ba29', '#ffe47a'];
    const champagneHighlights = ['#ffffff', '#fffbe6', '#fdf7d9', '#f7dfb3', '#fff3c4'];

    // Layer A: Deep bronze/amber shadow flakes for physical depth
    for (let i = 0; i < coarseCount; i++) {
      const fx = Math.random() * w;
      const fy = Math.random() * h;
      const size = Math.random() * 2.3 + 1.2;
      ctx.fillStyle = shadowGold[Math.floor(Math.random() * shadowGold.length)];
      ctx.globalAlpha = Math.random() * 0.65 + 0.35;
      ctx.beginPath();
      ctx.arc(fx, fy, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Layer B: Dense faceted 24K gold flakes with micro-relief bevels
    for (let i = 0; i < fineCount; i++) {
      const fx = Math.random() * w;
      const fy = Math.random() * h;
      const size = Math.random() * 2.4 + 0.8;
      const color = vibrantGold[Math.floor(Math.random() * vibrantGold.length)];

      // 3D micro drop-shadow behind each flake
      ctx.fillStyle = 'rgba(60, 35, 4, 0.4)';
      ctx.globalAlpha = 0.38;
      ctx.fillRect(fx + 0.6, fy + 0.6, size, size);

      // Metallic flake
      ctx.fillStyle = color;
      ctx.globalAlpha = Math.random() * 0.75 + 0.25;

      if (Math.random() > 0.4) {
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

    // Layer C: Specular diamond micro-crystals that catch ambient light
    for (let i = 0; i < specularCount; i++) {
      const fx = Math.random() * w;
      const fy = Math.random() * h;
      const size = Math.random() * 1.8 + 0.6;
      ctx.fillStyle = champagneHighlights[Math.floor(Math.random() * champagneHighlights.length)];
      ctx.globalAlpha = Math.random() * 0.85 + 0.15;
      ctx.beginPath();
      ctx.arc(fx, fy, size * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1.0;

    // 3. Stamped Golden Foil Beveled Rim along the Heart Perimeter
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(255, 240, 160, 0.85)';
    ctx.stroke(heartPath);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(160, 115, 20, 0.7)';
    ctx.stroke(heartPath);

    ctx.restore();
    return foilCanvas;
  };

  // Seed dynamic twinkling glitter particles strictly within the heart shape
  const initGlitterSparkles = (w: number, h: number, heartPath: Path2D) => {
    const testCanvas = document.createElement('canvas');
    testCanvas.width = w;
    testCanvas.height = h;
    const testCtx = testCanvas.getContext('2d');
    if (!testCtx) return;

    const sparkles: GlitterSparkle[] = [];
    const count = isDesktop ? 135 : 85;

    const sparkleColors = [
      '#ffffff', // Diamond white
      '#fffdf2', // Starlight white
      '#f7dfb3', // Champagne gold
      '#ffe5a3', // Soft champagne
      '#ffd700', // Bright 24K gold
      '#ffcc00', // Vibrant gold
      '#e0b477', // Soft antique gold
    ];

    for (let attempts = 0; attempts < 600 && sparkles.length < count; attempts++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      if (testCtx.isPointInPath(heartPath, x, y)) {
        sparkles.push({
          x,
          y,
          size: Math.random() * 2.8 + 1.2,
          color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
          speed: Math.random() * 0.05 + 0.02,
          phase: Math.random() * Math.PI * 2,
          maxBrightness: Math.random() * 0.45 + 0.55,
          hasStarFlare: Math.random() > 0.45,
          flareRays: Math.random() > 0.3 ? 4 : 6,
        });
      }
    }

    glitterSparklesRef.current = sparkles;
  };

  // Render a natural optical starburst / cross glint
  const drawStarFlare = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    alpha: number,
    rays: number,
    color: string
  ) => {
    if (alpha <= 0.02) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = alpha;

    // Glowing center bloom
    const radial = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 1.6);
    radial.addColorStop(0, '#ffffff');
    radial.addColorStop(0.4, color);
    radial.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(0, 0, size * 1.6, 0, Math.PI * 2);
    ctx.fill();

    // Sharp cross diffraction rays
    ctx.fillStyle = '#ffffff';
    for (let r = 0; r < rays; r++) {
      const angle = (r * Math.PI) / (rays / 2);
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(-size * 3.0, 0);
      ctx.lineTo(0, -size * 0.3);
      ctx.lineTo(size * 3.0, 0);
      ctx.lineTo(0, size * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  };

  // Celebration explosion of golden crystals upon reaching reveal threshold
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

    const particleCount = isDesktop ? 160 : 100;
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
        p.vy += 0.04;
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

      // Sample every 16th pixel for mobile efficiency
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

  // Erase with smooth interpolation and realistic feathered/soft fading edge
  const eraseOnMaskWithFadedEdge = (x1: number, y1: number, x2: number, y2: number) => {
    const mask = maskCanvasRef.current;
    if (!mask) return;
    const ctx = mask.getContext('2d');
    if (!ctx) return;

    const brushRadius = isDesktop ? 26 : 22;
    const dist = Math.hypot(x2 - x1, y2 - y1);
    const step = Math.max(4, brushRadius * 0.35);
    const steps = Math.max(1, Math.ceil(dist / step));

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';

    for (let s = 0; s <= steps; s++) {
      const t = steps === 0 ? 0 : s / steps;
      const cx = x1 + (x2 - x1) * t;
      const cy = y1 + (y2 - y1) * t;

      // Radial gradient brush with realistic soft feathered edge falloff
      const brushGrad = ctx.createRadialGradient(cx, cy, brushRadius * 0.45, cx, cy, brushRadius);
      brushGrad.addColorStop(0, 'rgba(0, 0, 0, 1)');
      brushGrad.addColorStop(0.7, 'rgba(0, 0, 0, 0.9)');
      brushGrad.addColorStop(0.88, 'rgba(0, 0, 0, 0.45)');
      brushGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = brushGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, brushRadius, 0, Math.PI * 2);
      ctx.fill();
    }

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

    // 2. Offscreen High-Density Golden Glitter Foil Texture (generated once & cached)
    foilTextureCanvasRef.current = buildRealisticGlitterFoil(w, h);

    // 3. Seed dynamic glittering particles inside the heart
    const heartPath = createHeartPath(w, h);
    initGlitterSparkles(w, h, heartPath);

    // Cancel any existing animation frame
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    // 60fps Dynamic Glitter, Specular Sheen & Twinkle Render Loop
    const renderLoop = (now: number) => {
      const ctx = canvas.getContext('2d');
      const maskCanvas = maskCanvasRef.current;
      const foilCanvas = foilTextureCanvasRef.current;

      if (!ctx || !maskCanvas || !foilCanvas) return;

      ctx.clearRect(0, 0, w, h);

      // Step A: Draw the Base Pre-rendered Metallic Glitter Foil
      ctx.drawImage(foilCanvas, 0, 0);

      const reducedMotion = prefersReducedMotionRef.current;

      // Step B: Moving Metallic Light Reflection (Smooth diagonal sweep across heart)
      ctx.save();
      ctx.clip(heartPath);

      // Diagonal axis angle ~40 degrees
      const sheenCycle = reducedMotion ? 0.5 : ((now * 0.00032) % 1.7) - 0.35;
      const sheenX = sheenCycle * w * 2.2 - w * 0.6;
      const sheenY = sheenCycle * h * 1.5 - h * 0.2;
      const sheenWidth = w * 0.65;

      const sheenGrad = ctx.createLinearGradient(sheenX, sheenY, sheenX + sheenWidth, sheenY + sheenWidth * 0.75);
      sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      sheenGrad.addColorStop(0.35, 'rgba(255, 248, 220, 0.4)');
      sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
      sheenGrad.addColorStop(0.65, 'rgba(255, 248, 220, 0.4)');
      sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.globalCompositeOperation = 'color-dodge';
      ctx.fillStyle = sheenGrad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Step C: Animated Twinkling Glitter Particles (Natural non-uniform glints)
      glitterSparklesRef.current.forEach((sparkle) => {
        if (!reducedMotion) {
          sparkle.phase += sparkle.speed;
        }

        // Natural non-linear glint curve (power of 8 gives sharp specular flashes rather than uniform blinking)
        const naturalSine = Math.sin(sparkle.phase);
        const glintFactor = Math.pow(Math.max(0, naturalSine), 8);

        // Extra illumination if the sweeping metallic sheen is passing directly over this particle
        const sheenCenterDist = Math.abs((sparkle.x * 0.65 + sparkle.y * 0.75) - (sheenX * 0.65 + sheenY * 0.75 + sheenWidth * 0.5));
        const sheenBoost = Math.max(0, 1 - sheenCenterDist / (sheenWidth * 0.45)) * 0.55;

        const effectiveAlpha = Math.min(1.0, glintFactor * sparkle.maxBrightness + sheenBoost);

        if (effectiveAlpha > 0.06) {
          if (sparkle.hasStarFlare && effectiveAlpha > 0.45) {
            drawStarFlare(ctx, sparkle.x, sparkle.y, sparkle.size * 1.5, effectiveAlpha, sparkle.flareRays, sparkle.color);
          } else {
            ctx.save();
            ctx.globalAlpha = effectiveAlpha;
            ctx.fillStyle = sparkle.color;
            ctx.beginPath();
            ctx.arc(sparkle.x, sparkle.y, sparkle.size * (0.8 + effectiveAlpha * 0.4), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      });

      // Step D: Active Scratch Dust Particles (tactile golden dust fluttering from touch)
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

      // Step E: Apply Feathered Scratch Mask (reveals the burgundy date underneath)
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

  // Handle pointer down (both touch and mouse)
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
    eraseOnMaskWithFadedEdge(x, y, x, y);
    emitScratchDust(x, y);
  };

  // Handle pointer move (both touch swipe and mouse drag)
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratchingRef.current || isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    if (lastPointRef.current) {
      eraseOnMaskWithFadedEdge(lastPointRef.current.x, lastPointRef.current.y, x, y);
      emitScratchDust(x, y);
    }
    lastPointRef.current = { x, y };
    checkScratchRatio();
  };

  // Handle pointer up & release
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
        
        {/* Exact Uploaded Background Artwork (Mobile & Desktop) */}
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
          {/* UNDERNEATH LAYER: Pure Wedding Date & Muhurtham Timing in Deep Burgundy */}
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
