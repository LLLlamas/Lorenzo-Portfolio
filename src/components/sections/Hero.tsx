'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { ReactNode } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';
import { ScrambleText } from '@/components/motion/ScrambleText';
import { copy } from '@/content/copy';

const FloatingGeometry = dynamic(
  () =>
    import('@/components/motion/FloatingGeometry').then(
      (m) => m.FloatingGeometry,
    ),
  { ssr: false },
);

type HeroProps = {
  pendulumControl?: ReactNode;
};

/**
 * Editorial hero — the name IS the composition. The stacked wordmark
 * clip-reveals character by character out of the void; scrolling away
 * parallaxes it upward and fades it (the page departs the launch pad).
 * Statement + subhead follow, CTAs are bracketed mono links.
 */
export function Hero({ pendulumControl }: HeroProps) {
  const prefersReduced = useReducedMotion();

  // Scroll-driven exit — wordmark lags the scroll and dissolves
  const { scrollY } = useScroll();
  const wordmarkY = useTransform(scrollY, [0, 700], [0, -110]);
  const wordmarkOpacity = useTransform(scrollY, [0, 550], [1, 0]);
  const statementY = useTransform(scrollY, [0, 700], [0, -50]);

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden px-6 pb-16 pt-20 md:pt-24"
    >
      {/* Faint accent radial — anchors the void */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            'radial-gradient(60rem 40rem at 50% 30%, var(--accent-soft) 0%, transparent 70%)',
        }}
      />

      {/* Floating tetrahedron — behind the wordmark, far right */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[-6%] top-8 -z-10 size-[260px] md:size-[440px] lg:size-[560px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <FloatingGeometry className="h-full w-full" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.p
          className="mb-8"
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <ScrambleText
            text={copy.hero.eyebrow}
            className="link-bracket text-[11px] md:text-xs"
            delay={300}
            duration={900}
          />
        </motion.p>

        {/* Giant stacked wordmark — per-character clip reveal, parallax exit */}
        <motion.h1
          className="font-display uppercase leading-[0.92] tracking-[-0.035em] text-ink"
          style={prefersReduced ? undefined : { y: wordmarkY, opacity: wordmarkOpacity }}
        >
          <span className="sr-only">{copy.hero.wordmark.join(' ')}</span>
          {copy.hero.wordmark.map((line, lineIndex) => (
            <span
              key={line}
              aria-hidden
              className="block overflow-hidden pb-[0.06em] text-[clamp(3.8rem,12.3vw,10rem)] font-extrabold"
            >
              {line.split('').map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  className="inline-block will-change-transform"
                  initial={prefersReduced ? false : { y: '112%', rotate: 6 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{
                    duration: 0.95,
                    delay: 0.3 + lineIndex * 0.22 + charIndex * 0.035,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {char}
                </motion.span>
              ))}
              {lineIndex === copy.hero.wordmark.length - 1 ? (
                <motion.span
                  className="inline-block align-top text-[0.22em] font-bold text-accent"
                  initial={prefersReduced ? false : { opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.3 + lineIndex * 0.22 + line.length * 0.035 + 0.25,
                    type: 'spring',
                    stiffness: 300,
                    damping: 18,
                  }}
                >
                  ®
                </motion.span>
              ) : null}
            </span>
          ))}
        </motion.h1>

        {/* Statement + subhead */}
        <motion.div
          className="mt-10 grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-16"
          style={prefersReduced ? undefined : { y: statementY }}
        >
          <motion.p
            className="max-w-xl text-pretty font-display text-2xl font-semibold leading-snug tracking-tight text-ink md:text-3xl"
            initial={prefersReduced ? false : { opacity: 0, y: 14, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {copy.hero.headline}
          </motion.p>

          <motion.p
            className="max-w-md text-pretty text-sm leading-relaxed text-ink-soft md:text-base"
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
          >
            {copy.hero.subhead}
          </motion.p>
        </motion.div>

        {/* CTAs + pendulum + annotation */}
        <motion.div
          className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6"
          initial={prefersReduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href={copy.hero.primaryCta.href}
            className="link-bracket link-bracket--accent text-[13px]"
            data-cursor-hover
          >
            <ScrambleText
              text={copy.hero.primaryCta.label}
              rescrambleOnHover
              duration={450}
            />
          </Link>
          <Link
            href={copy.hero.secondaryCta.href}
            className="link-bracket text-[13px]"
            data-cursor-hover
          >
            <ScrambleText
              text={copy.hero.secondaryCta.label}
              rescrambleOnHover
              duration={450}
            />
          </Link>

          {pendulumControl ? (
            <span className="hidden md:inline-flex">{pendulumControl}</span>
          ) : null}

          <span className="ml-auto hidden items-center gap-6 md:inline-flex">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              <span
                aria-hidden
                className="status-beacon motion-decorative inline-block size-1.5 rounded-full bg-accent"
              />
              {copy.meta.availability}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-quiet">
              {copy.hero.annotation}
            </span>
          </span>
        </motion.div>

        {/* Scroll affordance — the journey starts below */}
        <motion.div
          className="mt-10 hidden flex-col items-center gap-3 md:flex"
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.7, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-ink-quiet">
            {copy.hero.scrollHint}
          </span>
          <span className="h-10 w-px overflow-hidden bg-line">
            <span className="scroll-hint-line motion-decorative block h-full w-full bg-accent" />
          </span>
        </motion.div>
      </div>
    </section>
  );
}
