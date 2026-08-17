'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef, type RefObject } from 'react';

type Pt = { x: number; y: number };
type Palette = {
  composite: GlobalCompositeOperation;
  base: string;
  accents: string[];
};

const LIGHT_PALETTE: Palette = {
  composite: 'source-over',
  base: 'rgb(30 27 23)',
  accents: ['#bf5d3b', '#3a8fa0', '#c1842f'],
};

const DARK_PALETTE: Palette = {
  composite: 'lighter',
  base: 'rgb(255 255 255)',
  accents: ['#ea855c', '#5cb8c4', '#e4b45d'],
};

function pickKind() {
  const r = Math.random();
  return r < 0.72 ? 0 : r < 0.82 ? 1 : r < 0.91 ? 2 : 3;
}

const N_SHAPES = 120;

export function GridShapes({
  active,
  targetRef,
}: {
  active: boolean;
  targetRef: RefObject<HTMLElement | null>;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paletteRef = useRef<Palette>(LIGHT_PALETTE);
  const activeRef = useRef(active);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    paletteRef.current = isDark ? DARK_PALETTE : LIGHT_PALETTE;
  }, [resolvedTheme]);

  useEffect(() => {
    const hostEl = hostRef.current;
    const canvasEl = canvasRef.current;
    if (!hostEl || !canvasEl) return;
    const context = canvasEl.getContext('2d');
    if (!context) return;
    const host = hostEl;
    const canvas = canvasEl;
    const ctx = context;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = { x: 0, y: 0, active: false };

    // Shape info
    const spos: Pt[] = new Array(N_SHAPES);
    const sbaseX = new Float32Array(N_SHAPES);
    const sbaseY = new Float32Array(N_SHAPES);
    const srot = new Float32Array(N_SHAPES);
    const svrot = new Float32Array(N_SHAPES);
    const skind = new Uint8Array(N_SHAPES);
    const stype = new Uint8Array(N_SHAPES); // 0: circle, 1: rect, 2: triangle
    const ssize = new Float32Array(N_SHAPES);
    const sphase = new Float32Array(N_SHAPES);
    const salpha = new Float32Array(N_SHAPES);
    const sspeed = new Float32Array(N_SHAPES);

    for (let i = 0; i < N_SHAPES; i++) {
      sbaseX[i] = Math.random();
      sbaseY[i] = Math.random();
      spos[i] = { x: 0, y: 0 };
      srot[i] = Math.random() * Math.PI * 2;
      svrot[i] = (Math.random() - 0.5) * 0.05;
      skind[i] = pickKind();
      stype[i] = Math.floor(Math.random() * 3);
      ssize[i] = 10 + Math.random() * 20;
      sphase[i] = Math.random() * Math.PI * 2;
      salpha[i] = skind[i] === 0 ? 0.05 + Math.random() * 0.15 : 0.2 + Math.random() * 0.3;
      // ~15% of shapes are 'playful children' moving much faster
      sspeed[i] = Math.random() < 0.15 ? 12 + Math.random() * 15 : 1 + Math.random() * 0.5;
    }

    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;
    let influenceR = 190;
    let scale = 1;
    let initialized = false;

    function updateFocus() {
      const el = targetRef.current;
      if (!el || width < 2 || height < 2) {
        centerX = width / 2;
        centerY = height / 2;
        scale = Math.min(width, height) * 0.2;
        return;
      }
      const r = el.getBoundingClientRect();
      centerX = width / 2;
      centerY = height / 2;
      scale = Math.max(r.width, r.height) * 0.85;
    }

    function resize() {
      if (!host || !canvas) return;
      const rect = host.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      influenceR = Math.max(250, Math.min(450, Math.min(width, height) * 0.4));
      updateFocus();
      if (!initialized && width > 0 && height > 0) {
        for (let i = 0; i < N_SHAPES; i++) {
          spos[i].x = sbaseX[i] * width;
          spos[i].y = sbaseY[i] * height;
        }
        initialized = true;
      }
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(host);
    window.addEventListener('resize', resize);

    function setPointer(event: PointerEvent) {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      mouse.active = true;
    }
    function onLeave() {
      mouse.active = false;
    }

    window.addEventListener('pointermove', setPointer);
    window.addEventListener('pointerdown', setPointer);
    window.addEventListener('pointerup', onLeave);
    window.addEventListener('pointercancel', onLeave);

    function draw(time: number, dt: number) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      if (width === 0 || height === 0 || !activeRef.current) return;

      updateFocus();
      if (!initialized && width > 0 && height > 0) {
        for (let i = 0; i < N_SHAPES; i++) {
          spos[i].x = sbaseX[i] * width;
          spos[i].y = sbaseY[i] * height;
        }
        initialized = true;
      }

      const palette = paletteRef.current;
      ctx.globalCompositeOperation = palette.composite;

      const timeSec = time * 0.001;

      for (let i = 0; i < N_SHAPES; i++) {
        // Playful shapes wobble faster
        const wobbleSpeed = sspeed[i] > 5 ? 0.8 : 0.2;
        
        // Natural drift based on phase and speed
        sbaseX[i] += Math.cos(timeSec * wobbleSpeed + sphase[i]) * 0.03 * sspeed[i] * dt;
        sbaseY[i] += Math.sin(timeSec * wobbleSpeed + sphase[i]) * 0.03 * sspeed[i] * dt;
        srot[i] += svrot[i] * sspeed[i] * dt * 60;

        if (sbaseX[i] < 0) { sbaseX[i] += 1; spos[i].x += width; }
        if (sbaseX[i] > 1) { sbaseX[i] -= 1; spos[i].x -= width; }
        if (sbaseY[i] < 0) { sbaseY[i] += 1; spos[i].y += height; }
        if (sbaseY[i] > 1) { sbaseY[i] -= 1; spos[i].y -= height; }

        // Pull towards target area
        const distToCenter = Math.hypot(sbaseX[i] * width - centerX, sbaseY[i] * height - centerY);
        const focusPull = Math.max(0, 1 - distToCenter / (width * 0.5));
        
        // Circular orbit around center
        const orbitRadius = (i % 3 + 1) * 0.15 * scale;
        const orbitAngle = sphase[i] + timeSec * (i % 2 === 0 ? 0.5 : -0.5);
        const targetX = centerX + Math.cos(orbitAngle) * orbitRadius;
        const targetY = centerY + Math.sin(orbitAngle) * orbitRadius;

        const k = 1 - Math.exp(-dt * 1.5);
        const pullX = lerp(sbaseX[i] * width, targetX, 0.3 * focusPull);
        const pullY = lerp(sbaseY[i] * height, targetY, 0.3 * focusPull);

        spos[i].x += (pullX - spos[i].x) * k;
        spos[i].y += (pullY - spos[i].y) * k;

        // Mouse influence
        if (mouse.active) {
          const dx = mouse.x - spos[i].x;
          const dy = mouse.y - spos[i].y;
          const dist = Math.hypot(dx, dy);
          if (dist < influenceR) {
            const inf = 1 - dist / influenceR;
            spos[i].x -= dx * inf * 8.0 * dt; // repulse strongly
            spos[i].y -= dy * inf * 8.0 * dt;
            srot[i] += inf * dt * 25;
          }
        }

        const c = skind[i];
        ctx.fillStyle = c === 0 ? palette.base : palette.accents[c - 1];
        ctx.strokeStyle = c === 0 ? palette.base : palette.accents[c - 1];
        ctx.globalAlpha = salpha[i];

        ctx.save();
        ctx.translate(spos[i].x, spos[i].y);
        ctx.rotate(srot[i]);

        const size = ssize[i] * (c === 0 ? 0.7 : 1);

        ctx.beginPath();
        if (stype[i] === 0) {
          // Circle
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (stype[i] === 1) {
          // Square/Rect
          if (i % 2 === 0) {
            ctx.rect(-size / 2, -size / 2, size, size);
            ctx.fill();
          } else {
            ctx.lineWidth = 2;
            ctx.rect(-size / 2, -size / 2, size, size);
            ctx.stroke();
          }
        } else {
          // Triangle
          ctx.moveTo(0, -size / 2);
          ctx.lineTo(size / 2, size / 2);
          ctx.lineTo(-size / 2, size / 2);
          ctx.closePath();
          if (i % 2 === 0) {
            ctx.fill();
          } else {
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }

        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    if (reduceMotion) {
      updateFocus();
      for (let i = 0; i < N_SHAPES; i++) {
        spos[i].x = sbaseX[i] * width;
        spos[i].y = sbaseY[i] * height;
      }
      if (activeRef.current) draw(0, 0);
      return () => {
        ro.disconnect();
        window.removeEventListener('resize', resize);
        window.removeEventListener('pointermove', setPointer);
        window.removeEventListener('pointerdown', setPointer);
        window.removeEventListener('pointerup', onLeave);
        window.removeEventListener('pointercancel', onLeave);
      };
    }

    let raf = 0;
    let last = performance.now();
    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      draw(now, dt);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', setPointer);
      window.removeEventListener('pointerdown', setPointer);
      window.removeEventListener('pointerup', onLeave);
      window.removeEventListener('pointercancel', onLeave);
    };
  }, [targetRef]);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-0 ${
        active ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-500`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
