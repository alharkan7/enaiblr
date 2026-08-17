'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef, type RefObject } from 'react';

type Pt = { x: number; y: number };
type Supershape = { m: number; n1: number; n2: number; n3: number };
type Palette = {
  composite: GlobalCompositeOperation;
  base: string;
  accents: string[];
};

const KEYFRAMES: Supershape[] = [
  { m: 6, n1: 2.0, n2: 2.0, n3: 2.0 },
  { m: 4, n1: 4.0, n2: 4.0, n3: 4.0 },
  { m: 8, n1: 2.0, n2: 2.0, n3: 2.0 },
  { m: 6, n1: 1.5, n2: 1.5, n3: 2.4 },
  { m: 5, n1: 2.5, n2: 2.5, n3: 2.5 },
  { m: 3, n1: 2.5, n2: 2.5, n3: 2.5 },
];

const N_BOUND = 720;
const N_FREE = 980;
const OUTLINE_SAMPLES = 540;
const SEGMENT_MS = 4800;

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

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function pickKind() {
  const r = Math.random();
  return r < 0.72 ? 0 : r < 0.82 ? 1 : r < 0.91 ? 2 : 3;
}

function gauss() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function supershapeOutline(p: Supershape, samples: number): Pt[] {
  const pts: Pt[] = [];
  let maxR = 0;
  for (let i = 0; i < samples; i++) {
    const theta = (i / samples) * Math.PI * 2;
    const phi = (p.m * theta) / 4;
    const c = Math.pow(Math.abs(Math.cos(phi)), p.n2);
    const s = Math.pow(Math.abs(Math.sin(phi)), p.n3);
    const r = Math.pow(c + s, -1 / p.n1);
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    const rr = Math.hypot(x, y);
    if (rr > maxR) maxR = rr;
    pts.push({ x, y });
  }
  for (const pt of pts) {
    pt.x /= maxR;
    pt.y /= maxR;
  }
  return pts;
}

function resample(dense: Pt[], count: number): Pt[] {
  const m = dense.length;
  const cum = new Float64Array(m + 1);
  for (let i = 0; i < m; i++) {
    const a = dense[i];
    const b = dense[(i + 1) % m];
    cum[i + 1] = cum[i] + Math.hypot(b.x - a.x, b.y - a.y);
  }
  const total = cum[m];
  const out: Pt[] = new Array(count);
  for (let i = 0; i < count; i++) {
    const target = (i / count) * total;
    let lo = 0;
    let hi = m;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] <= target) lo = mid + 1;
      else hi = mid;
    }
    const seg = lo - 1;
    const segLen = cum[seg + 1] - cum[seg];
    const f = segLen > 0 ? (target - cum[seg]) / segLen : 0;
    const a = dense[seg];
    const b = dense[(seg + 1) % m];
    out[i] = { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
  }
  return out;
}

export function GridParticles({
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
    const outlines = KEYFRAMES.map((k) =>
      resample(supershapeOutline(k, OUTLINE_SAMPLES), N_BOUND),
    );
    const target: Pt[] = Array.from({ length: N_BOUND }, () => ({ x: 0, y: 0 }));
    const mouse = { x: 0, y: 0, active: false };

    const bpos: Pt[] = new Array(N_BOUND);
    const bkind = new Uint8Array(N_BOUND);
    const balpha = new Float32Array(N_BOUND);
    const brad = new Float32Array(N_BOUND);
    const bphase = new Float32Array(N_BOUND);
    const bdx = new Float32Array(N_BOUND);
    const bdy = new Float32Array(N_BOUND);
    for (let i = 0; i < N_BOUND; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.2 + Math.random() * 2.4;
      bpos[i] = { x: Math.cos(a) * r, y: Math.sin(a) * r };
      const k = pickKind();
      bkind[i] = k;
      balpha[i] = k === 0 ? 0.28 + Math.random() * 0.4 : 0.6 + Math.random() * 0.35;
      brad[i] = 0.35 + Math.random() * 1.9;
      bphase[i] = Math.random() * Math.PI * 2;
    }

    const fxs = new Float32Array(N_FREE);
    const fys = new Float32Array(N_FREE);
    const fseed = new Float32Array(N_FREE);
    const fkind = new Uint8Array(N_FREE);
    const falpha = new Float32Array(N_FREE);
    const fsize = new Float32Array(N_FREE);
    const fnear = new Uint8Array(N_FREE);
    for (let i = 0; i < N_FREE; i++) {
      fxs[i] = Math.random();
      fys[i] = Math.random();
      fseed[i] = Math.random() * Math.PI * 2;
      const k = pickKind();
      fkind[i] = k;
      fnear[i] = Math.random() < 0.55 ? 1 : 0;
      falpha[i] = fnear[i]
        ? k === 0
          ? 0.18 + Math.random() * 0.32
          : 0.35 + Math.random() * 0.4
        : k === 0
          ? 0.08 + Math.random() * 0.16
          : 0.16 + Math.random() * 0.22;
      fsize[i] = 0.7 + Math.random() * 1.1;
    }

    let width = 0;
    let height = 0;
    let scale = 1;
    let centerX = 0;
    let centerY = 0;
    let influenceR = 190;
    let tileNx = 0.5;
    let tileNy = 0.5;

    function placeNearTile() {
      const a = Math.random() * Math.PI * 2;
      const r = Math.abs(gauss()) * 0.16;
      return {
        x: tileNx + Math.cos(a) * r,
        y: tileNy + Math.sin(a) * r,
      };
    }

    function updateFocus() {
      const el = targetRef.current;
      if (!el || width < 2 || height < 2) {
        centerX = width / 2;
        centerY = height / 2;
        scale = Math.min(width, height) * 0.2;
        tileNx = 0.5;
        tileNy = 0.5;
        return;
      }
      const r = el.getBoundingClientRect();
      centerX = r.left + r.width / 2;
      centerY = r.top + r.height / 2;
      scale = Math.max(r.width, r.height) * 0.85;
      tileNx = centerX / width;
      tileNy = centerY / height;
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
    }
    resize();
    for (let i = 0; i < N_FREE; i++) {
      if (fnear[i]) {
        const p = placeNearTile();
        fxs[i] = p.x;
        fys[i] = p.y;
      }
    }

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

    function computeTarget(time: number) {
      const cycle = KEYFRAMES.length * SEGMENT_MS;
      const tnorm = (time % cycle) / SEGMENT_MS;
      const i = Math.floor(tnorm) % KEYFRAMES.length;
      const j = (i + 1) % KEYFRAMES.length;
      const e = smoothstep(tnorm - Math.floor(tnorm));
      const a = outlines[i];
      const b = outlines[j];
      for (let k = 0; k < N_BOUND; k++) {
        target[k].x = lerp(a[k].x, b[k].x, e);
        target[k].y = lerp(a[k].y, b[k].y, e);
      }
    }

    function draw(time: number, dt: number) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      if (width === 0 || height === 0 || !activeRef.current) return;

      updateFocus();

      const palette = paletteRef.current;
      ctx.globalCompositeOperation = palette.composite;

      const flow = time * 0.0002;
      const drift = 0.05 * dt;
      const mxn = mouse.active ? mouse.x / width : 0;
      const myn = mouse.active ? mouse.y / height : 0;
      for (let i = 0; i < N_FREE; i++) {
        const ang =
          (Math.sin(fxs[i] * 5 + flow) + Math.cos(fys[i] * 5 - flow * 1.3) + fseed[i]) *
          Math.PI;
        fxs[i] += Math.cos(ang) * drift;
        fys[i] += Math.sin(ang) * drift;
        if (fnear[i]) {
          fxs[i] += (tileNx - fxs[i]) * 0.015 * dt;
          fys[i] += (tileNy - fys[i]) * 0.015 * dt;
        }
        if (mouse.active) {
          const ddx = mxn - fxs[i];
          const ddy = myn - fys[i];
          const dist = Math.hypot(ddx * width, ddy * height);
          if (dist < influenceR) {
            const inf = 1 - dist / influenceR;
            fxs[i] += ddx * inf * 0.6 * dt;
            fys[i] += ddy * inf * 0.6 * dt;
          }
        }
        if (fxs[i] < -0.06 || fxs[i] > 1.06 || fys[i] < -0.06 || fys[i] > 1.06) {
          if (fnear[i]) {
            const p = placeNearTile();
            fxs[i] = p.x;
            fys[i] = p.y;
          } else {
            if (fxs[i] < -0.06) fxs[i] = 1.06;
            else if (fxs[i] > 1.06) fxs[i] = -0.06;
            if (fys[i] < -0.06) fys[i] = 1.06;
            else if (fys[i] > 1.06) fys[i] = -0.06;
          }
        }

        const c = fkind[i];
        ctx.fillStyle = c === 0 ? palette.base : palette.accents[c - 1];
        ctx.globalAlpha = falpha[i];
        ctx.beginPath();
        ctx.arc(fxs[i] * width, fys[i] * height, (c === 0 ? 0.9 : 1.3) * fsize[i], 0, Math.PI * 2);
        ctx.fill();
      }

      computeTarget(time);
      const k = 1 - Math.exp(-dt * 3.4);
      const rot = time * 0.00055;
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);
      const s = scale * (1 + 0.025 * Math.sin(time * 0.0008));
      for (let i = 0; i < N_BOUND; i++) {
        const jx = Math.cos(time * 0.0009 + bphase[i]) * 0.02;
        const jy = Math.sin(time * 0.0009 + bphase[i]) * 0.02;
        const tx = (target[i].x + jx) * brad[i];
        const ty = (target[i].y + jy) * brad[i];
        bpos[i].x += (tx - bpos[i].x) * k;
        bpos[i].y += (ty - bpos[i].y) * k;

        const px = centerX + (bpos[i].x * cosR - bpos[i].y * sinR) * s;
        const py = centerY + (bpos[i].x * sinR + bpos[i].y * cosR) * s;

        let wx = 0;
        let wy = 0;
        if (mouse.active) {
          const ddx = mouse.x - px;
          const ddy = mouse.y - py;
          const dist = Math.hypot(ddx, ddy);
          if (dist < influenceR) {
            const inf = 1 - dist / influenceR;
            wx = ddx * inf * 0.5;
            wy = ddy * inf * 0.5;
          }
        }
        bdx[i] += (wx - bdx[i]) * 0.18;
        bdy[i] += (wy - bdy[i]) * 0.18;

        const c = bkind[i];
        ctx.fillStyle = c === 0 ? palette.base : palette.accents[c - 1];
        ctx.globalAlpha = balpha[i];
        ctx.beginPath();
        ctx.arc(px + bdx[i], py + bdy[i], c === 0 ? 1.3 : 1.9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    if (reduceMotion) {
      updateFocus();
      computeTarget(0);
      for (let i = 0; i < N_BOUND; i++) {
        bpos[i].x = target[i].x * brad[i];
        bpos[i].y = target[i].y * brad[i];
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
