'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { withBasePath } from '@/lib/utils';

type Slide = { sectionId: string; src: string; pos: string };

// NYC + LA city backdrops — one cinematic scene per section
const SLIDES: Slide[] = [
  { sectionId: 'hero',         src: '/backgrounds/city-nyc-freedom-tower-night.jpg', pos: '50% 40%' },
  { sectionId: 'about',        src: '/backgrounds/city-towers-night.jpg',             pos: '50% 40%' },
  { sectionId: 'work',         src: '/backgrounds/city-nyc-aerial-night.jpg',         pos: '50% 50%' },
  { sectionId: 'capabilities', src: '/backgrounds/city-nyc-skyline-night.jpg',        pos: '50% 45%' },
  { sectionId: 'packages',     src: '/backgrounds/city-la-aerial-night.jpg',          pos: '50% 55%' },
  { sectionId: 'faq',          src: '/backgrounds/city-nyc-bridge.jpg',               pos: '50% 50%' },
  { sectionId: 'contact-cta',  src: '/backgrounds/city-nyc-empire-state-msg.jpg',     pos: '50% 25%' },
];

export function PageBackground() {
  const driftRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const prefersReduced = useReducedMotion();

  // Subtle parallax — image drifts at 2.5% of scroll speed
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
      {/* Parallax container — scale(1.08) keeps edges covered during drift */}
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
                // Inactive slides sit slightly below and zoomed — they rise and contract into place
                transform: isActive ? 'scale(1) translateY(0px)' : 'scale(1.07) translateY(22px)',
                transition: [
                  'opacity 1900ms cubic-bezier(0.4,0,0.2,1)',
                  'transform 2700ms cubic-bezier(0.22,1,0.36,1)',
                ].join(', '),
                willChange: 'opacity, transform',
              }}
            >
              {/* Ken Burns: 18 s linear transition — barely moves during crossfade,
                  then slowly zooms while the slide is active */}
              <div
                className="absolute inset-0"
                style={{
                  transform: isActive ? 'scale(1.07)' : 'scale(1)',
                  transition: 'transform 18000ms linear',
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
            </div>
          );
        })}
      </div>

      {/* Thin top shield — protects the transparent header only; no vignette elsewhere */}
      <div
        className="absolute inset-x-0 top-0"
        style={{
          height: '14%',
          background: 'linear-gradient(180deg, rgba(16,15,28,0.32) 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
