'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
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
 * Editorial hero — the name IS the composition. Giant stacked wordmark
 * clip-reveals line by line out of the void, statement + subhead follow,
 * CTAs are bracketed mono links. FloatingGeometry drifts behind the type.
 */
export function Hero({ pendulumControl }: HeroProps) {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden px-6 pb-20 pt-20 md:pt-28"
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

        {/* Giant stacked wordmark */}
        <h1 className="font-display uppercase leading-[0.92] tracking-[-0.035em] text-ink">
          {copy.hero.wordmark.map((line, i) => (
            <span
              key={line}
              className="block overflow-hidden pb-[0.06em] text-[clamp(3.8rem,13.5vw,11rem)] font-extrabold"
            >
              <motion.span
                className="block will-change-transform"
                initial={prefersReduced ? false : { y: '110%' }}
                animate={{ y: 0 }}
                transition={{
                  duration: 1.1,
                  delay: 0.35 + i * 0.14,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {line}
                {i === copy.hero.wordmark.length - 1 ? (
                  <span className="align-top text-[0.22em] font-bold text-accent">
                    ®
                  </span>
                ) : null}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Statement + subhead */}
        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-16">
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
        </div>

        {/* CTAs + pendulum + annotation */}
        <motion.div
          className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6 md:mt-16"
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

          <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-[0.2em] text-ink-quiet md:inline">
            {copy.hero.annotation}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
