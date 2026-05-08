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

/**
 * Generic modal/dialog primitive.
 *
 *  - Backdrop fade + spring panel
 *  - Slides up from the bottom on mobile (items-end), centers on md+
 *  - ESC and click-outside close
 *  - Body scroll locked while open
 *  - Focus moves to the panel on open; restored on close
 *  - Honors prefers-reduced-motion (instant fade, no slide/scale)
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

    // Focus the panel after enter animation kicks off.
    const t = setTimeout(() => {
      panelRef.current?.focus();
    }, 50);

    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
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
          transition={{ duration: 0.18 }}
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-ink/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={label}
            tabIndex={-1}
            className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-2xl border border-line bg-bg-elevated shadow-2xl outline-none md:max-h-[90vh] md:rounded-2xl"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            transition={prefersReduced
              ? { duration: 0.12 }
              : { type: 'spring', stiffness: 220, damping: 26 }
            }
          >
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
