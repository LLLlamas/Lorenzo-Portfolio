'use client';

import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

const TOUCH_QUERY = '(hover: none) and (pointer: coarse)';
const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], summary, label, input, textarea, select, [data-cursor-hover]';

/**
 * Golden / amber dot cursor — the "point of light in the void."
 *
 * Two layers: a small accent dot (the actual cursor) and a larger ring
 * that lerps with delay, giving the feel of a tracking reticle. On
 * interactive elements the ring expands and dims.
 *
 * Disabled on touch devices and under prefers-reduced-motion. When active,
 * sets data-cursor="custom" on <html> so the system cursor is hidden via CSS.
 */
export function CustomCursor() {
  const prefersReduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReduced) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia(TOUCH_QUERY).matches) return;
    setEnabled(true);
  }, [prefersReduced]);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.setAttribute('data-cursor', 'custom');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;
    let visible = false;

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const onEnter = () => {
      visible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    let isHovering = false;
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(INTERACTIVE_SELECTOR);
      if (!!interactive !== isHovering) {
        isHovering = !!interactive;
        ring.dataset.hover = isHovering ? '1' : '0';
      }
    };

    const tick = () => {
      // Dot snaps to cursor (acts like a real cursor).
      dotX = mouseX;
      dotY = mouseY;
      // Ring lerps for the trailing reticle feel.
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.documentElement.removeAttribute('data-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Dot — point of light */}
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[120] size-[6px] rounded-full opacity-0 transition-opacity duration-200"
        style={{
          background: 'var(--accent)',
          boxShadow: '0 0 12px var(--accent), 0 0 24px var(--accent-soft)',
          willChange: 'transform',
        }}
      />
      {/* Ring — tracking reticle */}
      <div
        ref={ringRef}
        aria-hidden
        data-hover="0"
        className="pointer-events-none fixed left-0 top-0 z-[120] size-8 rounded-full border opacity-0 transition-[width,height,border-color,opacity,backdrop-filter] duration-200 data-[hover='1']:size-12 data-[hover='1']:bg-[var(--accent-soft)]"
        style={{
          borderColor: 'var(--accent)',
          willChange: 'transform',
        }}
      />
    </>
  );
}
