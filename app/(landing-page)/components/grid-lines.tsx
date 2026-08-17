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

const N_NODES = 95;

export function GridLines({
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

    // Node graph
    const npos: Pt[] = new Array(N_NODES);
    const ntpos: Pt[] = new Array(N_NODES);
    const nkind = new Uint8Array(N_NODES);
    const nvx = new Float32Array(N_NODES);
    const nvy = new Float32Array(N_NODES);
    const nbaseX = new Float32Array(N_NODES);
    const nbaseY = new Float32Array(N_NODES);

    for (let i = 0; i < N_NODES; i++) {
      npos[i] = { x: 0, y: 0 };
      ntpos[i] = { x: 0, y: 0 };
      nbaseX[i] = Math.random();
      nbaseY[i] = Math.random();
      nvx[i] = (Math.random() - 0.5) * 0.1;
      nvy[i] = (Math.random() - 0.5) * 0.1;
      nkind[i] = pickKind();
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
      centerX = r.left + r.width / 2;
      centerY = r.top + r.height / 2;
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
      influenceR = Math.max(160, Math.min(280, Math.min(width, height) * 0.28));
      updateFocus();
      if (!initialized && width > 0 && height > 0) {
        for (let i = 0; i < N_NODES; i++) {
          npos[i].x = nbaseX[i] * width;
          npos[i].y = nbaseY[i] * height;
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
        for (let i = 0; i < N_NODES; i++) {
          npos[i].x = nbaseX[i] * width;
          npos[i].y = nbaseY[i] * height;
        }
        initialized = true;
      }

      const palette = paletteRef.current;
      ctx.globalCompositeOperation = palette.composite;

      const timeSec = time * 0.001;

      // Update positions
      for (let i = 0; i < N_NODES; i++) {
        // Natural drift
        nbaseX[i] += nvx[i] * dt * 0.2;
        nbaseY[i] += nvy[i] * dt * 0.2;

        if (nbaseX[i] < 0) { nbaseX[i] += 1; npos[i].x += width; }
        if (nbaseX[i] > 1) { nbaseX[i] -= 1; npos[i].x -= width; }
        if (nbaseY[i] < 0) { nbaseY[i] += 1; npos[i].y += height; }
        if (nbaseY[i] > 1) { nbaseY[i] -= 1; npos[i].y -= height; }

        const k = 1 - Math.exp(-dt * 2.0);
        const targetX = nbaseX[i] * width;
        const targetY = nbaseY[i] * height;

        npos[i].x += (targetX - npos[i].x) * k;
        npos[i].y += (targetY - npos[i].y) * k;

        // Mouse influence
        if (mouse.active) {
          const dx = mouse.x - npos[i].x;
          const dy = mouse.y - npos[i].y;
          const dist = Math.hypot(dx, dy);
          if (dist < influenceR) {
            const inf = 1 - dist / influenceR;
            npos[i].x += dx * inf * 0.5 * dt;
            npos[i].y += dy * inf * 0.5 * dt;
          }
        }
      }

      // Draw lines between close nodes
      ctx.lineWidth = 1;
      const maxDist = Math.max(180, width * 0.14);
      
      for (let i = 0; i < N_NODES; i++) {
        const c1 = nkind[i];
        for (let j = i + 1; j < N_NODES; j++) {
          const dx = npos[i].x - npos[j].x;
          const dy = npos[i].y - npos[j].y;
          const dist = Math.hypot(dx, dy);
          
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.3;
            ctx.beginPath();
            ctx.moveTo(npos[i].x, npos[i].y);
            ctx.lineTo(npos[j].x, npos[j].y);
            ctx.strokeStyle = c1 === 0 ? palette.base : palette.accents[c1 - 1];
            ctx.globalAlpha = alpha;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < N_NODES; i++) {
        const c = nkind[i];
        ctx.fillStyle = c === 0 ? palette.base : palette.accents[c - 1];
        ctx.globalAlpha = 0.6 + Math.random() * 0.4;
        ctx.beginPath();
        ctx.arc(npos[i].x, npos[i].y, c === 0 ? 1.5 : 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    if (reduceMotion) {
      updateFocus();
      for (let i = 0; i < N_NODES; i++) {
        npos[i].x = nbaseX[i] * width;
        npos[i].y = nbaseY[i] * height;
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
