'use client';

import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Single source of truth for reduced-motion gating.
 * Every motion primitive should branch on this — never re-implement the check.
 *
 * SSR-safe: returns `false` on the server / first render, then syncs to the
 * real value after mount. This means animations briefly flash on initial paint
 * for users who prefer reduced motion — Phase 2 mitigates this with a CSS
 * `@media (prefers-reduced-motion: reduce)` rule that hides decorative motion
 * outright at the CSS layer.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    setPrefersReduced(mq.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setPrefersReduced(event.matches);
    };

    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return prefersReduced;
}
