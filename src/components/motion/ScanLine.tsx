'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

/**
 * CRT scan line — a thin accent rule that draws across when scrolled into
 * view. Drop into section headers / between scenes for a "switching channel"
 * beat between sections.
 */
export function ScanLine({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (prefersReduced) {
      setArmed(true);
      return;
    }
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [prefersReduced]);

  return (
    <span
      ref={ref}
      aria-hidden
      className={cn(
        'block h-px w-full origin-left bg-gradient-to-r from-accent via-accent to-transparent',
        armed ? 'section-scan' : 'scale-x-0 opacity-0',
        className,
      )}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}
