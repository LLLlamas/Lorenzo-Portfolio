'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { withBasePath } from '@/lib/utils';

const IMAGES = [
  { src: '/backgrounds/bg-stars.jpg', pos: '50% 40%' },
  { src: '/backgrounds/bg-nebula.jpg', pos: '50% 30%' },
  { src: '/backgrounds/bg-aurora.jpg', pos: '50% 60%' },
  { src: '/backgrounds/bg-space.jpg', pos: '50% 50%' },
];

export function HeroBackground() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;
    const el = parallaxRef.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      el.style.transform = `translateY(${(window.scrollY * 0.16).toFixed(1)}px)`;
      raf = 0;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [prefersReduced]);

  useEffect(() => {
    if (prefersReduced || IMAGES.length < 2) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % IMAGES.length),
      9000,
    );
    return () => clearInterval(id);
  }, [prefersReduced]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-30 overflow-hidden"
    >
      {/* Parallax container — scaled up 30% so translateY never reveals edges */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 scale-[1.3]"
        style={{ willChange: 'transform' }}
      >
        {IMAGES.map(({ src, pos }, i) => (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-[3000ms] ease-in-out"
            style={{ opacity: i === active ? 1 : 0 }}
          >
            <Image
              src={withBasePath(src)}
              alt=""
              fill
              priority={i === 0}
              className="object-cover"
              style={{ objectPosition: pos }}
              sizes="100vw"
              quality={90}
            />
          </div>
        ))}
      </div>

      {/* Vignette + bottom fade to solid bg */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(16,15,28,0.65) 0%, rgba(16,15,28,0.28) 20%, rgba(16,15,28,0.40) 60%, rgba(16,15,28,0.88) 85%, var(--bg) 100%)',
        }}
      />

      {/* Brand-color radial — keeps the void-presence mood */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, var(--accent-soft) 0%, transparent 70%)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
}
