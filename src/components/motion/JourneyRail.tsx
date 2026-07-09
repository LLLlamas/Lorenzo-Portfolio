'use client';

import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

const TICKS = 7;

/**
 * HUD telemetry rail — fixed to the right viewport edge on large screens.
 * A vertical hairline with evenly spaced ticks, a diamond marker that
 * descends with raw scroll fraction (no section tracking), and a mono
 * altitude readout counting scroll depth. Purely decorative instrument
 * chrome; hidden < lg and under reduced motion.
 */
export function JourneyRail() {
  const prefersReduced = usePrefersReducedMotion();
  const markerRef = useRef<HTMLDivElement | null>(null);
  const readoutRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (prefersReduced) return;
    const marker = markerRef.current;
    const readout = readoutRef.current;
    if (!marker || !readout) return;

    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const f = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      marker.style.top = `${(f * 100).toFixed(2)}%`;
      readout.textContent = `ALT ${String(Math.round(f * 100)).padStart(3, '0')} // ${f >= 1 ? 'ARRIVED' : 'EN ROUTE'}`;
      raf = 0;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex"
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-ink-quiet [writing-mode:vertical-rl]">
        SYS // NOMINAL
      </span>

      <div className="relative h-[30vh] w-px bg-line">
        {/* Ticks */}
        {Array.from({ length: TICKS }, (_, i) => (
          <span
            key={i}
            className="absolute left-1/2 h-px w-2 -translate-x-1/2 bg-ink-quiet/50"
            style={{ top: `${(i / (TICKS - 1)) * 100}%` }}
          />
        ))}
        {/* Scroll marker */}
        <div
          ref={markerRef}
          className="absolute left-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent shadow-[0_0_8px_var(--accent)]"
          style={{ top: '0%' }}
        />
      </div>

      <span
        ref={readoutRef}
        className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink-quiet [writing-mode:vertical-rl]"
      >
        ALT 000 // EN ROUTE
      </span>
    </div>
  );
}
