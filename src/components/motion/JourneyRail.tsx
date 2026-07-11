'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';
import { navigation } from '@/content/navigation';
import { cn } from '@/lib/utils';

const WAYPOINTS = navigation.waypoints;

/**
 * Journey rail v2 — right-edge waypoint navigation for the landing page.
 * A vertical hairline with one labeled, clickable diamond tick per section;
 * the current section's label reads in accent, a marker diamond descends by
 * raw scroll fraction between the ticks, and a mono readout at the base shows
 * `0N / LABEL`. Only rendered on the landing page (waypoint ids must exist);
 * hidden < lg. Functional nav, so it stays mounted under reduced motion —
 * only the springy visuals calm down via the global gate.
 */
export function JourneyRail() {
  const prefersReduced = usePrefersReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [present, setPresent] = useState(false);
  const markerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Only meaningful on the landing page where the sections exist
    const sections = WAYPOINTS.map((w) => document.getElementById(w.id));
    if (sections.filter(Boolean).length < WAYPOINTS.length - 1) {
      setPresent(false);
      return;
    }
    setPresent(true);

    let raf = 0;
    const update = () => {
      const y = window.scrollY;
      const activationLine = y + window.innerHeight * 0.35;

      let next = 0;
      sections.forEach((el, i) => {
        if (!el) return;
        const top = el.getBoundingClientRect().top + y;
        if (top <= activationLine) next = i;
      });
      setActiveIndex(next);

      if (markerRef.current) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const f = max > 0 ? Math.min(y / max, 1) : 0;
        markerRef.current.style.top = `${(f * 100).toFixed(2)}%`;
      }
      raf = 0;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  if (!present) return null;

  const active = WAYPOINTS[activeIndex];

  return (
    <nav
      aria-label="Section shortcuts"
      className="fixed right-8 top-1/2 z-30 hidden -translate-y-1/2 lg:block"
    >
      <div className="relative flex items-stretch gap-4">
        {/* Labels + ticks */}
        <ol className="flex flex-col justify-between gap-5 text-right">
          {WAYPOINTS.map((w, i) => {
            const isActive = i === activeIndex;
            return (
              <li key={w.id}>
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(w.id)
                      ?.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' })
                  }
                  aria-label={`Go to ${w.label}`}
                  aria-current={isActive ? 'true' : undefined}
                  data-cursor-hover
                  className="group flex cursor-pointer items-center justify-end gap-3"
                >
                  <span
                    className={cn(
                      'font-mono text-[9px] uppercase tracking-[0.22em] transition-[color,opacity,letter-spacing] duration-300',
                      isActive
                        ? 'text-accent opacity-100 tracking-[0.3em]'
                        : 'text-ink-quiet opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100',
                    )}
                  >
                    {w.label}
                  </span>
                  <span
                    className={cn(
                      'size-1.5 rotate-45 transition-[background-color,box-shadow,transform] duration-300',
                      isActive
                        ? 'scale-125 bg-accent shadow-[0_0_10px_var(--accent)]'
                        : 'bg-ink-quiet/50 group-hover:bg-ink-soft',
                    )}
                  />
                </button>
              </li>
            );
          })}
        </ol>

        {/* Rail + raw-scroll marker */}
        <div aria-hidden className="relative w-px bg-line">
          <div
            ref={markerRef}
            className="absolute left-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink-soft"
            style={{ top: '0%' }}
          />
        </div>
      </div>

      {/* Readout — a div (not p) so CursorGlow's word-wrapper leaves it alone;
          keyed so React swaps the node when the waypoint changes */}
      <div
        aria-hidden
        key={active.id}
        className="mt-5 text-right font-mono text-[9px] uppercase tracking-[0.24em] text-ink-quiet"
      >
        <span className="text-accent">{String(activeIndex + 1).padStart(2, '0')}</span>
        <span>{` / ${active.label}`}</span>
      </div>
    </nav>
  );
}
