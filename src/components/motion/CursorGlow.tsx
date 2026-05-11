'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

const TOUCH_QUERY = '(hover: none) and (pointer: coarse)';
const SIZE = 420;
const HALF = SIZE / 2;
const GLOW_RADIUS = 210; // matches the visual ambient radius

// Text elements that receive a thin outline when within the glow radius.
// Excludes .btn-sweep (buttons/links) and tiny mono labels.
const TEXT_SELECTOR = 'h1, h2, h3, h4, p, li, a:not(.btn-sweep)';
const MIN_FONT_SIZE = 13; // px — skip captions / eyebrow mono labels

function refreshOutlines(cx: number, cy: number, els: HTMLElement[]) {
  // Read all rects in one batch to avoid repeated layout flushes
  const rects = els.map((el) => el.getBoundingClientRect());
  // Then write: toggle data-glow only when state changes
  for (let i = 0; i < els.length; i++) {
    const r = rects[i];
    // Closest-point-on-rect to cursor (0 if cursor is inside)
    const dx = Math.max(r.left - cx, 0, cx - r.right);
    const dy = Math.max(r.top - cy, 0, cy - r.bottom);
    const inGlow = dx * dx + dy * dy < GLOW_RADIUS * GLOW_RADIUS;
    const wasGlow = els[i].dataset.glow === '1';
    if (inGlow !== wasGlow) {
      els[i].dataset.glow = inGlow ? '1' : '0';
    }
  }
}

export function CursorGlow() {
  const prefersReduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReduced) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia(TOUCH_QUERY).matches) return;
    setEnabled(true);
  }, [prefersReduced]);

  useEffect(() => {
    if (!enabled) return;
    const el = layerRef.current;
    if (!el) return;

    let raf = 0;
    let cx = -HALF * 3;
    let cy = -HALF * 3;
    let visible = false;

    // Collect text elements once; filter to min font size
    const textEls = Array.from(
      document.querySelectorAll<HTMLElement>(TEXT_SELECTOR),
    ).filter((node) => parseFloat(getComputedStyle(node).fontSize) >= MIN_FONT_SIZE);

    // Prime every collected element with data-glow="0" so the CSS transition
    // selector [data-glow] matches from the very first cursor entry
    textEls.forEach((node) => { node.dataset.glow = '0'; });

    const onMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      if (!visible) {
        visible = true;
        el.style.opacity = '1';
      }
      refreshOutlines(cx, cy, textEls);
    };

    const tick = () => {
      el.style.transform = `translate3d(${cx - HALF}px, ${cy - HALF}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      textEls.forEach((node) => { delete node.dataset.glow; });
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[5] opacity-0 transition-opacity duration-700"
      style={{
        width: SIZE,
        height: SIZE,
        willChange: 'transform',
        background:
          'radial-gradient(40px circle at 50% 50%, color-mix(in srgb, white 18%, transparent), transparent 100%), ' +
          'radial-gradient(210px circle at 50% 50%, color-mix(in srgb, var(--accent) 22%, transparent), transparent 100%)',
      }}
    />
  );
}
