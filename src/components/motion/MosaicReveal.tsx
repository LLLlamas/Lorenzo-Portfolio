'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

const COLS = 7;
const ROWS = 4;

/**
 * Mosaic tile reveal — content is covered by a COLS×ROWS grid of ground-color
 * tiles that dissolve in a deterministic pseudo-random order once the wrapper
 * scrolls into view. The editorial "image assembles from blocks" beat.
 * Reduced-motion (and post-reveal) renders children with no overlay work.
 */
export function MosaicReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (prefersReduced) {
      setRevealed(true);
      setSettled(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [prefersReduced]);

  // Drop the tile layer entirely once the dissolve has finished.
  useEffect(() => {
    if (!revealed || settled) return;
    const t = window.setTimeout(() => setSettled(true), 1400);
    return () => window.clearTimeout(t);
  }, [revealed, settled]);

  const tiles = COLS * ROWS;

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {children}
      {!settled ? (
        <div
          aria-hidden
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          }}
        >
          {Array.from({ length: tiles }, (_, i) => {
            // Deterministic shuffle — coprime stride walks the grid "randomly"
            const order = (i * 11) % tiles;
            return (
              <div
                key={i}
                style={{
                  background: 'var(--bg)',
                  opacity: revealed ? 0 : 1,
                  // slight overdraw hides sub-pixel seams between tiles
                  margin: '-0.5px',
                  transition: `opacity 420ms var(--ease-out-expo) ${(order / tiles) * 780}ms`,
                }}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
