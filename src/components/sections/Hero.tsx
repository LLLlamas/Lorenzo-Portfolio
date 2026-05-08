'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { SplitTextReveal } from '@/components/motion/SplitTextReveal';
import { copy } from '@/content/copy';

export function Hero() {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden px-6 pb-24 pt-32 md:pt-44"
    >
      {/* Drifting accent blob — pure CSS @keyframes; honors reduced motion via globals.css */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-[680px] rounded-full bg-accent-soft/60 blur-3xl hero-blob motion-decorative"
      />

      <div className="mx-auto max-w-5xl">
        <motion.p
          className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-quiet"
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {copy.hero.eyebrow}
        </motion.p>

        <SplitTextReveal
          as="h1"
          className="font-display text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
          text={copy.hero.headline}
          delay={0.24}
          step={0.06}
        />

        <motion.p
          className="mt-6 max-w-2xl text-pretty text-lg text-ink-soft md:text-xl"
          initial={prefersReduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {copy.hero.subhead}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap gap-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 0.9 },
            },
          }}
        >
          {[copy.hero.primaryCta, copy.hero.secondaryCta].map((cta, i) => (
            <motion.div
              key={cta.href}
              variants={{
                hidden: prefersReduced
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.96, y: 8 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    type: 'spring',
                    stiffness: 220,
                    damping: 24,
                  },
                },
              }}
            >
              <Button
                href={cta.href}
                variant={i === 0 ? 'primary' : 'ghost'}
                size="lg"
              >
                {cta.label}
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
