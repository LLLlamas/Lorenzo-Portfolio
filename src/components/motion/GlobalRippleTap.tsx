'use client';

import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

const RIPPLE_SIZE = 280;

export function GlobalRippleTap() {
  const prefersReduced = usePrefersReducedMotion();
  const surfaceRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReduced) return;
    if (typeof window === 'undefined' || !('ontouchstart' in window)) return;
    const surface = surfaceRef.current;
    if (!surface) return;

    const spawn = (clientX: number, clientY: number) => {
      const ripple = document.createElement('span');
      ripple.className = 'ripple-expand';
      ripple.style.width = `${RIPPLE_SIZE}px`;
      ripple.style.height = `${RIPPLE_SIZE}px`;
      ripple.style.left = `${clientX - RIPPLE_SIZE / 2}px`;
      ripple.style.top = `${clientY - RIPPLE_SIZE / 2}px`;
      ripple.style.background = 'var(--line-accent)';
      ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
      surface.appendChild(ripple);
    };

    const onTouch = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      spawn(touch.clientX, touch.clientY);
    };

    document.addEventListener('touchstart', onTouch, { passive: true });
    return () => document.removeEventListener('touchstart', onTouch);
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div
      ref={surfaceRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[55] overflow-hidden"
    />
  );
}
