'use client';

import { useEffect } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

/**
 * Fallback for browsers without `animation-timeline: view()` (Safari, Firefox).
 * Lerps the scale of every `.scroll-scale` element between 0.88 and 1.0 as it
 * enters the viewport. Native-supporting browsers (Chromium) skip this entirely
 * — the CSS in globals.css handles it on the compositor.
 */
export function ScrollScaleMount() {
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    if (typeof window === 'undefined') return;
    if (
      typeof CSS !== 'undefined' &&
      CSS.supports('animation-timeline', 'view()')
    ) {
      return;
    }

    let raf = 0;
    let scheduled = false;

    const update = () => {
      scheduled = false;
      const vh = window.innerHeight;
      const elements = document.querySelectorAll<HTMLElement>('.scroll-scale');
      elements.forEach((el) => {
        const r = el.getBoundingClientRect();
        const t = Math.min(Math.max(1 - r.top / (vh * 0.62), 0), 1);
        const scale = 0.88 + 0.12 * t;
        el.style.transform = `scale(${scale.toFixed(4)})`;
      });
    };

    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [prefersReduced]);

  return null;
}
