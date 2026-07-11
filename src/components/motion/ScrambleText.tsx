'use client';

import {
  createElement,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ElementType,
} from 'react';
import { useReducedMotion } from 'motion/react';

const GLYPHS = '#/\\<>[]{}|=+*_—ABCDEFGHIKLMNOPRSTUVWXYZ0123456789';

/**
 * Terminal-style glyph scramble. Characters cycle through random glyphs and
 * resolve left→right into the real text. Fires once when scrolled into view;
 * optionally re-fires on hover (nav links). Reduced-motion renders plain text.
 */
export function ScrambleText({
  text,
  as = 'span',
  className,
  duration = 700,
  delay = 0,
  rescrambleOnHover = false,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  duration?: number;
  delay?: number;
  rescrambleOnHover?: boolean;
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const rafRef = useRef(0);
  const [display, setDisplay] = useState(text);
  const [played, setPlayed] = useState(false);

  const run = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const t = Math.min(Math.max((now - start) / duration, 0), 1);
      const settled = Math.floor(t * text.length);
      let next = text.slice(0, settled);
      for (let i = settled; i < text.length; i += 1) {
        const ch = text[i];
        next += ch === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setDisplay(next);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [delay, duration, text]);

  useEffect(() => {
    setDisplay(text);
    setPlayed(false);
  }, [text]);

  useEffect(() => {
    if (prefersReduced || played) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPlayed(true);
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [played, prefersReduced, run]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return createElement(
    as,
    {
      ref,
      className,
      onMouseEnter: rescrambleOnHover && !prefersReduced ? run : undefined,
      'aria-label': text,
    },
    <span aria-hidden>{display}</span>,
  );
}
