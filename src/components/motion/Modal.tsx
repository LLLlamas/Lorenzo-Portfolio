'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** ARIA label for the dialog. */
  label?: string;
};

// Pre-computed burst geometry — 8 particles evenly spaced, varied distances
const BURST = Array.from({ length: 8 }, (_, i) => ({
  angle: (i * 45 * Math.PI) / 180,
  dist: 52 + (i % 3) * 28,
  size: 3 + (i % 3),
  delay: 0.05 + i * 0.018,
}));

/**
 * Generic modal/dialog primitive.
 *
 *  - Disapparition vortex: spinning conic ring + burst particles + panel swirl-in
 *  - Backdrop fade + spring panel
 *  - Slides up from the bottom on mobile (items-end), centers on md+
 *  - ESC and click-outside close
 *  - Body scroll locked while open
 *  - Focus moves to the panel on open; restored on close
 *  - Honors prefers-reduced-motion (instant fade, no vortex)
 */
export function Modal({ open, onClose, children, label }: Props) {
  const prefersReduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // ESC + scroll lock + focus management
  useEffect(() => {
    if (!open) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Pause Lenis so wheel events scroll the modal panel, not the page.
    window.__lenis?.stop();

    const t = setTimeout(() => panelRef.current?.focus(), 50);

    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      window.__lenis?.start();
      lastFocusedRef.current?.focus?.();
    };
  }, [open, onClose]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-end justify-center md:items-center md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReduced ? 0.12 : 0.22 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="modal-glass-backdrop absolute inset-0 cursor-default"
          />

          {/* Vortex + panel wrapper — relative container for absolute vortex elements */}
          <div className="relative z-10 w-full max-w-4xl">

            {!prefersReduced ? (
              <>
                {/* Spinning conic vortex ring — materializes from a point, spins
                    660° as the panel appears, then evaporates. On exit it briefly
                    re-ignites and implodes in reverse (opacity [0.75, 0] keyframe). */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute -inset-[10%] rounded-full"
                  style={{
                    background:
                      'conic-gradient(from 0deg, transparent 0%, color-mix(in srgb, var(--accent) 55%, transparent) 18%, transparent 38%, color-mix(in srgb, var(--accent) 28%, transparent) 58%, transparent 78%, color-mix(in srgb, var(--accent) 44%, transparent) 92%, transparent 100%)',
                    filter: 'blur(12px)',
                  }}
                  initial={{ scale: 0.1, opacity: 0, rotate: 0 }}
                  animate={{ scale: [0.1, 1.08, 0.94], rotate: 660, opacity: [0, 0.9, 0] }}
                  exit={{ scale: [0.5, 0.08], rotate: -480, opacity: [0.75, 0] }}
                  transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Burst particles — 8 accent dots shoot outward as panel materializes */}
                {BURST.map(({ angle, dist, size, delay }, i) => (
                  <motion.div
                    key={i}
                    aria-hidden
                    className="pointer-events-none absolute rounded-full bg-accent"
                    style={{ width: size, height: size, left: '50%', top: '40%' }}
                    initial={{ x: '-50%', y: '-50%', opacity: 0, scale: 0 }}
                    animate={{
                      x: `calc(-50% + ${Math.cos(angle) * dist}px)`,
                      y: `calc(-50% + ${Math.sin(angle) * dist}px)`,
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                    }}
                    transition={{ duration: 0.44, delay, ease: [0.16, 1, 0.3, 1] }}
                  />
                ))}

                {/* Accent energy flash — resolves as the panel settles into focus */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-10 rounded-t-2xl md:rounded-2xl"
                  style={{
                    background:
                      'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.05), transparent 68%)',
                  }}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </>
            ) : null}

            {/* Panel — swirls in from a compressed, rotated, blurred state */}
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={label}
              tabIndex={-1}
              data-lenis-prevent
              className="modal-glass-panel relative max-h-[92vh] w-full overflow-y-auto overscroll-contain rounded-t-2xl border outline-none md:max-h-[90vh] md:rounded-2xl"
              initial={prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.22, rotate: 16, filter: 'blur(24px)' }
              }
              animate={prefersReduced
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }
              }
              exit={prefersReduced
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.18, rotate: -14, filter: 'blur(24px)' }
              }
              transition={prefersReduced
                ? { duration: 0.12 }
                : {
                    type: 'spring',
                    stiffness: 290,
                    damping: 22,
                    filter: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                  }
              }
            >
              {children}
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
