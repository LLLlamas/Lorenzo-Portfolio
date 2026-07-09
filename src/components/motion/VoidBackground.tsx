'use client';

import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

type Star = {
  x: number; // 0–1 of viewport width
  y: number; // 0–1 of viewport height
  z: number; // depth: higher = closer = faster parallax + brighter
  r: number;
  phase: number;
  speed: number;
};

const STAR_COUNT = 170;
const LAYERS = [0.12, 0.28, 0.5]; // parallax factor per depth band

function makeStars(): Star[] {
  return Array.from({ length: STAR_COUNT }, () => {
    const z = LAYERS[Math.floor(Math.random() * LAYERS.length)];
    return {
      x: Math.random(),
      y: Math.random(),
      z,
      r: 0.4 + Math.random() * (z * 2.2),
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 1.1,
    };
  });
}

/**
 * The void, v2 — a scroll-parallax starfield behind everything.
 * Canvas draws three depth bands of stars that drift upward at different
 * rates as the page scrolls (deeper = slower), each twinkling on its own
 * phase. On top: the dot grid, two drifting accent orbs, and two CSS
 * shooting-star streaks on long delay loops. No images, no three.js.
 * Reduced motion: a single static star draw — no loop, no streaks.
 */
export function VoidBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stars = makeStars();
    let raf = 0;
    let running = true;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let inkRGB = '245, 244, 238';

    const readInk = () => {
      // Stars take the theme's ink color so they read in light mode too
      const probe = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim();
      if (/^#([0-9a-f]{6})$/i.test(probe)) {
        const n = parseInt(probe.slice(1), 16);
        inkRGB = `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
      }
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      const scrollY = window.scrollY;
      for (const s of stars) {
        const y = (((s.y * height - scrollY * s.z) % height) + height) % height;
        const twinkle = prefersReduced
          ? 0.55
          : 0.42 + 0.34 * Math.sin(t * 0.001 * s.speed + s.phase);
        ctx.beginPath();
        ctx.arc(s.x * width, y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${inkRGB}, ${(twinkle * (0.25 + s.z)).toFixed(3)})`;
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    };

    readInk();
    resize();

    if (prefersReduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      resize();
      if (prefersReduced) draw(0);
    };
    const onVisibility = () => {
      running = document.visibilityState === 'visible';
      if (running && !prefersReduced) raf = requestAnimationFrame(loop);
      else cancelAnimationFrame(raf);
    };
    // Repaint star color when the theme class flips
    const themeObserver = new MutationObserver(() => {
      readInk();
      if (prefersReduced) draw(0);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [prefersReduced]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: -1, background: 'var(--bg)' }}
    >
      {/* Dot grid — barely-there technical texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in srgb, var(--ink) 6%, transparent) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
          maskImage:
            'radial-gradient(120% 90% at 50% 30%, black 0%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(120% 90% at 50% 30%, black 0%, transparent 78%)',
        }}
      />

      {/* Parallax starfield */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Drifting accent orbs */}
      <div
        className="void-orb void-orb--a motion-decorative absolute"
        style={{
          width: '55vw',
          height: '55vw',
          top: '-18%',
          left: '-12%',
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--accent) 13%, transparent) 0%, transparent 68%)',
        }}
      />
      <div
        className="void-orb void-orb--b motion-decorative absolute"
        style={{
          width: '48vw',
          height: '48vw',
          bottom: '-20%',
          right: '-10%',
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--accent-secondary) 11%, transparent) 0%, transparent 66%)',
        }}
      />

      {/* Shooting stars — long-delay streaks, killed under reduced motion */}
      {!prefersReduced ? (
        <>
          <span className="shooting-star motion-decorative" style={{ top: '12%', left: '68%', animationDelay: '4s' }} />
          <span className="shooting-star motion-decorative" style={{ top: '32%', left: '18%', animationDelay: '13s' }} />
        </>
      ) : null}
    </div>
  );
}
