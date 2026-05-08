'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

const NOISE = '!<>-_\\/[]{}—=+*^?#________';

/**
 * Signal-resolve text — characters scramble through random noise glyphs
 * then "lock in" to the real text, like a CRT tuning into a station.
 *
 * Triggers when the element scrolls into view. Reduced-motion users get
 * the plain text immediately.
 */
export function SignalResolve({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();
  const elRef = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(prefersReduced ? text : '');

  useEffect(() => {
    if (prefersReduced) {
      setDisplay(text);
      return;
    }
    if (!elRef.current) return;

    let cancelled = false;
    let raf = 0;
    let startedAt = 0;
    const TOTAL = 1100; // ms total resolve duration
    const REVEAL = 0.55; // fraction of duration spent fully revealing

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now() + delay * 1000;
        const tick = (now: number) => {
          if (cancelled) return;
          if (now < start) {
            raf = requestAnimationFrame(tick);
            return;
          }
          if (!startedAt) startedAt = now;
          const elapsed = now - startedAt;
          const progress = Math.min(elapsed / TOTAL, 1);
          const revealed = Math.floor((progress / REVEAL) * text.length);
          let out = '';
          for (let i = 0; i < text.length; i++) {
            if (i < revealed) {
              out += text[i];
            } else if (text[i] === ' ') {
              out += ' ';
            } else {
              out += NOISE[Math.floor(Math.random() * NOISE.length)];
            }
          }
          setDisplay(out);
          if (progress < 1) {
            raf = requestAnimationFrame(tick);
          } else {
            setDisplay(text);
          }
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(elRef.current);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [text, prefersReduced, delay]);

  return (
    <span ref={elRef} className={className} aria-label={text}>
      <span aria-hidden>{display || ' '}</span>
    </span>
  );
}
