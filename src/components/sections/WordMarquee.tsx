'use client';

import { Fragment, useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';
import { copy } from '@/content/copy';

const BASE_SPEED = 2.2; // %/s of one half-track

/** Wrap v into [min, max) — keeps the track looping seamlessly. */
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return min + (((v - min) % range) + range) % range;
};

/**
 * Velocity-reactive outline marquee. The track drifts continuously; scrolling
 * pours energy into it — speed multiplies with scroll velocity, direction
 * follows scroll direction, and the whole strip skews like it's taking G's.
 * Reduced motion renders a static strip.
 */
export function WordMarquee() {
  const prefersReduced = usePrefersReducedMotion();
  const baseX = useMotionValue(0);
  const directionRef = useRef(1);

  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [-2500, 0, 2500], [-6, 0, 6], {
    clamp: false,
  });
  const skewX = useTransform(smoothVelocity, [-3000, 3000], ['5deg', '-5deg']);

  useAnimationFrame((_, delta) => {
    if (prefersReduced) return;
    let moveBy = directionRef.current * BASE_SPEED * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) directionRef.current = -1;
    else if (vf > 0) directionRef.current = 1;
    moveBy += directionRef.current * Math.abs(vf) * BASE_SPEED * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  // Each half doubles the word list so one half always exceeds the viewport
  const words = [...copy.marquee, ...copy.marquee];

  const half = (keyPrefix: string) => (
    <span className="flex shrink-0 items-center">
      {words.map((word, i) => (
        <Fragment key={`${keyPrefix}-${i}`}>
          <span className="marquee-word px-6 font-display text-[clamp(3rem,7vw,5.5rem)] font-extrabold uppercase leading-none tracking-[-0.02em] md:px-10">
            {word}
          </span>
          <span className="size-2 shrink-0 rotate-45 bg-accent/70" />
        </Fragment>
      ))}
    </span>
  );

  if (prefersReduced) {
    return (
      <div className="overflow-hidden border-y border-line py-8 md:py-10" aria-hidden>
        <div className="flex w-max items-center">{half('static')}</div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden border-y border-line py-8 md:py-10" aria-hidden>
      <motion.div
        className="flex w-max items-center will-change-transform"
        style={{ x, skewX }}
      >
        {half('a')}
        {half('b')}
      </motion.div>
    </div>
  );
}
