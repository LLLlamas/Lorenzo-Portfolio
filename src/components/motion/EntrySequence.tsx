'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

/**
 * 4-act page-load entry sequence — the PS1 startup, mode-aware.
 *
 *   Act 1 (0.0–0.7s):   pure ground (void or warm cream) — opaque overlay.
 *   Act 2 (0.3–1.4s):   accent radial glow expands from center.
 *   Act 3 (0.55–1.6s):  horizontal accent scan line sweeps left→right.
 *   Act 4 (0.7–1.6s):   ground fades from opaque to transparent, revealing
 *                       the page beneath. Hero's own SplitTextReveal +
 *                       FloatingGeometry are timed to come in during this
 *                       window so the hero literally emerges from the void.
 *
 * Plays once per session (sessionStorage). Reduced-motion + returning users
 * skip it. Renders nothing on SSR — short flash of the page before the
 * overlay claims the screen on first paint, but no blank-screen penalty
 * for repeat visits.
 */
export function EntrySequence() {
  const prefersReduced = useReducedMotion();
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (prefersReduced) return;
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('entry-played') === '1') return;
    sessionStorage.setItem('entry-played', '1');
    setShow(true);
    const t = window.setTimeout(() => setShow(false), 1700);
    const t2 = window.setTimeout(() => setDone(true), 2100);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(t2);
    };
  }, [prefersReduced]);

  if (done) return null;

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          key="entry"
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[80]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
        >
          {/* Ground — fades from opaque to transparent over the sequence,
              so the hero beneath is literally rising out of the void. */}
          <motion.div
            className="absolute inset-0 bg-bg"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.0, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Act 2: radial accent glow */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0.6], scale: 1.1 }}
            transition={{
              duration: 1.4,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1],
              opacity: { times: [0, 0.4, 1] },
            }}
            style={{
              background:
                'radial-gradient(circle at 50% 50%, var(--accent-soft) 0%, transparent 55%)',
            }}
          />

          {/* Act 3: horizontal scan line sweep */}
          <motion.div
            className="absolute left-0 right-0 top-1/2 h-px"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 1, 0] }}
            transition={{
              duration: 1.05,
              delay: 0.55,
              ease: [0.16, 1, 0.3, 1],
              opacity: { times: [0, 0.18, 0.85, 1] },
            }}
            style={{
              transformOrigin: 'left center',
              background: 'var(--accent)',
              boxShadow: '0 0 24px var(--accent)',
            }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
