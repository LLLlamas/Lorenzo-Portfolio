'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { withBasePath } from '@/lib/utils';

type Slide = { sectionId: string; src: string; pos: string };

// City backdrops — each section gets its own cinematic scene (all people-free)
const SLIDES: Slide[] = [
  { sectionId: 'hero',         src: '/backgrounds/city-skyscraper-roads.jpg', pos: '50% 60%' },
  { sectionId: 'about',        src: '/backgrounds/city-towers-night.jpg',      pos: '50% 40%' },
  { sectionId: 'work',         src: '/backgrounds/city-bright-aerial.jpg',    pos: '50% 50%' },
  { sectionId: 'capabilities', src: '/backgrounds/city-seattle-twilight.jpg', pos: '50% 40%' },
  { sectionId: 'packages',     src: '/backgrounds/city-vibrant-aerial.jpg',   pos: '50% 50%' },
  { sectionId: 'faq',          src: '/backgrounds/city-nyc-bridge.jpg',       pos: '50% 50%' },
  { sectionId: 'contact-cta',  src: '/backgrounds/city-reflection.jpg',       pos: '50% 60%' },
];

export function PageBackground() {
  const driftRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const prefersReduced = useReducedMotion();

  // Subtle parallax — image drifts at 3% of scroll speed inside the fixed viewport
  useEffect(() => {
    if (prefersReduced) return;
    const el = driftRef.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      el.style.transform = `scale(1.08) translateY(${(window.scrollY * 0.025).toFixed(1)}px)`;
      raf = 0;
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [prefersReduced]);

  // Section-triggered image swaps via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SLIDES.forEach(({ sectionId }, idx) => {
      const el = document.getElementById(sectionId);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveIdx(idx); },
        { threshold: 0.25 },
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: -1 }}
    >
      {/* Parallax container — slight scale keeps edges covered during drift */}
      <div
        ref={driftRef}
        className="absolute inset-0"
        style={{ transform: 'scale(1.08)', willChange: 'transform' }}
      >
        {SLIDES.map(({ src, pos }, i) => {
          const isActive = i === activeIdx;
          return (
            <div
              key={src}
              className="absolute inset-0"
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'scale(1)' : 'scale(1.06)',
                transition: 'opacity 2200ms cubic-bezier(0.4,0,0.2,1), transform 2600ms cubic-bezier(0.4,0,0.2,1)',
                willChange: 'opacity, transform',
              }}
            >
              <Image
                src={withBasePath(src)}
                alt=""
                fill
                priority={i === 0}
                className="object-cover"
                style={{ objectPosition: pos }}
                sizes="100vw"
                quality={85}
              />
            </div>
          );
        })}
      </div>

      {/* Vignette — heavy at edges, lighter in the centre so city lights read */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(16,15,28,0.70) 0%, rgba(16,15,28,0.30) 18%, rgba(16,15,28,0.35) 55%, rgba(16,15,28,0.58) 78%, rgba(16,15,28,0.85) 100%)',
        }}
      />

      {/* Brand accent haze — purple glow that plays off city lights */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, var(--accent-soft) 0%, transparent 68%)',
          mixBlendMode: 'screen',
          opacity: 0.55,
        }}
      />
    </div>
  );
}
