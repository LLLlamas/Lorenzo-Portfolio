'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ScrambleText } from '@/components/motion/ScrambleText';
import { navigation } from '@/content/navigation';
import { copy } from '@/content/copy';

const COLUMNS = 5;

/**
 * Full-screen editorial menu. Five ground-color columns wipe down in a
 * stagger to build the surface, then giant numbered destinations clip-reveal
 * line by line. A mono meta row (status beacon + coordinates) anchors the
 * bottom. ESC closes; scroll is locked while open; focus moves into the
 * dialog and is restored on close.
 */
export function OverlayMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const prefersReduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocusedRef.current = document.activeElement as HTMLElement | null;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      // Focus trap — Tab/Shift+Tab cycle within the dialog; without this,
      // focus escapes into the scroll-locked page behind the overlay.
      if (e.key === 'Tab') {
        const panel = panelRef.current;
        if (!panel) return;
        const focusables = panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        const inside = active ? panel.contains(active) : false;
        if (e.shiftKey && (!inside || active === first)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (!inside || active === last)) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.__lenis?.stop();

    const t = setTimeout(() => panelRef.current?.focus(), 60);

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
          key="overlay-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          tabIndex={-1}
          data-lenis-prevent
          className="fixed inset-0 z-[70] overflow-y-auto outline-none"
          initial={{ opacity: prefersReduced ? 0 : 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3, delay: prefersReduced ? 0 : 0.25 } }}
        >
          {/* Column wipe — five panels build the ground in a stagger */}
          <div aria-hidden className="fixed inset-0 flex">
            {Array.from({ length: COLUMNS }, (_, i) => (
              <motion.div
                key={i}
                className="h-full flex-1"
                style={{
                  background: 'var(--bg)',
                  boxShadow: 'inset -1px 0 0 color-mix(in srgb, var(--ink) 5%, transparent)',
                }}
                initial={prefersReduced ? { y: 0 } : { y: '-101%' }}
                animate={{ y: 0 }}
                exit={prefersReduced ? { opacity: 0 } : { y: '-101%' }}
                transition={{
                  duration: prefersReduced ? 0.1 : 0.5,
                  delay: prefersReduced ? 0 : i * 0.055,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            ))}
          </div>

          {/* Faint dot grid over the wiped ground */}
          <motion.div
            aria-hidden
            className="fixed inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle, color-mix(in srgb, var(--ink) 6%, transparent) 1px, transparent 1px)',
              backgroundSize: '34px 34px',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: prefersReduced ? 0 : 0.35 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          />

          <div className="relative flex min-h-dvh flex-col pb-10">
            {/* Top row — wordmark + close, mirrors the header positions */}
            <motion.div
              className="mx-auto flex h-24 w-full max-w-6xl items-center justify-between gap-6 px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: prefersReduced ? 0 : 0.3, duration: 0.4 } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <span className="font-mono text-[13px] uppercase tracking-[0.22em] text-ink">
                {copy.meta.name}
                <span className="text-accent">®</span>
              </span>
              <button
                type="button"
                onClick={onClose}
                className="link-bracket cursor-pointer text-[11px]"
                data-cursor-hover
              >
                <ScrambleText text={copy.nav.close} rescrambleOnHover duration={400} />
              </button>
            </motion.div>

            {/* Destinations */}
            <nav
              aria-label="Menu"
              className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 py-10"
            >
              {navigation.overlay.map((link, i) => (
                <div key={link.href} className="overflow-hidden border-b border-line/60 first:border-t">
                  <motion.div
                    initial={prefersReduced ? { opacity: 0 } : { y: '105%' }}
                    animate={
                      prefersReduced
                        ? { opacity: 1 }
                        : {
                            y: 0,
                            transition: {
                              duration: 0.8,
                              delay: 0.32 + i * 0.07,
                              ease: [0.16, 1, 0.3, 1],
                            },
                          }
                    }
                    exit={
                      prefersReduced
                        ? { opacity: 0 }
                        : {
                            y: '105%',
                            transition: { duration: 0.28, delay: (navigation.overlay.length - i) * 0.03 },
                          }
                    }
                  >
                    <Link
                      href={link.href}
                      onClick={onClose}
                      aria-label={link.label}
                      data-cursor-hover
                      className="group flex items-baseline gap-5 py-4 md:gap-10 md:py-5"
                    >
                      <span className="font-mono text-xs text-accent md:text-sm">
                        0{i + 1}/
                      </span>
                      <span
                        className="ghost-title font-display text-4xl font-extrabold uppercase leading-none tracking-[-0.02em] text-ink transition-[letter-spacing,color] duration-300 group-hover:text-accent md:text-7xl"
                        data-text={link.label}
                      >
                        {link.label}
                      </span>
                      <span
                        aria-hidden
                        className="ml-auto hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ink-quiet transition-transform duration-300 group-hover:translate-x-1 md:inline"
                      >
                        →
                      </span>
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>

            {/* Bottom meta row */}
            <motion.div
              className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: prefersReduced ? 0 : 0.6, duration: 0.5 },
              }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
                <span
                  aria-hidden
                  className="status-beacon motion-decorative inline-block size-1.5 rounded-full bg-accent"
                />
                {copy.meta.availability}
              </span>
              <Link
                href="/contact"
                onClick={onClose}
                className="link-bracket link-bracket--accent text-[11px]"
                data-cursor-hover
              >
                {copy.hero.secondaryCta.label}
              </Link>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-quiet">
                {copy.hero.annotation}
              </span>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
