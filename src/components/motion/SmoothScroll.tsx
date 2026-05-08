'use client';

import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

const TOUCH_QUERY = '(hover: none) and (pointer: coarse)';

/**
 * Lenis-powered smooth scroll. Mounts at the root.
 *
 * Bypassed entirely on:
 *  - prefers-reduced-motion: reduce
 *  - touch devices (native momentum is better there)
 *
 * Lenis is dynamically imported to keep it out of the initial bundle.
 */
export function SmoothScroll() {
  const prefersReduced = usePrefersReducedMotion();
  const lenisRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    if (prefersReduced) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia(TOUCH_QUERY).matches) return;

    let raf = 0;
    let cancelled = false;

    (async () => {
      const { default: Lenis } = await import('lenis');
      if (cancelled) return;

      const lenis = new Lenis({
        lerp: 0.1,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        smoothWheel: true,
      });

      lenisRef.current = lenis;

      const tick = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      // Hand programmatic anchor scroll over to Lenis so /#section links
      // glide instead of jumping.
      const handleAnchorClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement | null;
        const anchor = target?.closest('a[href*="#"]') as HTMLAnchorElement | null;
        if (!anchor) return;
        const url = new URL(anchor.href, window.location.href);
        if (url.pathname !== window.location.pathname) return;
        if (!url.hash) return;
        const el = document.querySelector(url.hash);
        if (!el) return;
        event.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -64 });
      };

      document.addEventListener('click', handleAnchorClick);

      lenisRef.current = {
        destroy: () => {
          document.removeEventListener('click', handleAnchorClick);
          lenis.destroy();
        },
      };
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, [prefersReduced]);

  return null;
}
