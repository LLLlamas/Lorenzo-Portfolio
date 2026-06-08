'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { SplitTextReveal } from '@/components/motion/SplitTextReveal';
import { RippleTap } from '@/components/motion/RippleTap';
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

export function Hero({ pendulumControl }: HeroProps) {
  const prefersReduced = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden px-6 pb-24 pt-32 md:pt-44"
    >
      {/* Faint accent radial — replaces the old blob, anchors the void */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background:
            'radial-gradient(60rem 40rem at 50% 30%, var(--accent-soft) 0%, transparent 70%)',
        }}
      />

      {/* Floating tetrahedron — sits behind copy, far right.
          top-12 (was top-1/4) keeps the bottom clear of the section's
          overflow-hidden clip on shorter hero stacks. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[-4%] top-12 -z-10 size-[260px] md:size-[420px] lg:size-[520px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <FloatingGeometry className="h-full w-full" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.p
          className="aura-pop mb-6 text-sm font-bold uppercase tracking-[0.18em] text-ink-soft [text-shadow:0_1px_6px_rgba(0,0,0,0.85)]"
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="label-select">{copy.hero.eyebrow}</span>
        </motion.p>

        <SplitTextReveal
          as="h1"
          className="font-display text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl [text-shadow:0_2px_16px_rgba(16,15,28,0.9),0_4px_48px_rgba(16,15,28,0.7)]"
          text={copy.hero.headline}
          delay={0.3}
          step={0.06}
        />

        <motion.p
          className="mt-6 max-w-2xl text-pretty text-lg text-ink md:text-xl [text-shadow:0_1px_10px_rgba(16,15,28,0.95)]"
          initial={prefersReduced ? false : { opacity: 0, y: 12, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          {copy.hero.subhead}
        </motion.p>

        <motion.div
          className="relative mt-10 flex flex-col gap-5 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08, delayChildren: 1.05 },
            },
          }}
        >
          <div className="flex flex-wrap items-center gap-3 md:justify-self-start">
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
                <RippleTap className="rounded-full">
                  <Button
                    href={cta.href}
                    variant={i === 0 ? 'accent' : 'ghost'}
                    size="lg"
                  >
                    {cta.label}
                  </Button>
                </RippleTap>
              </motion.div>
            ))}

          </div>

          {pendulumControl ? (
            <motion.div
              className="hidden md:flex md:justify-self-center"
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
              {pendulumControl}
            </motion.div>
          ) : <span aria-hidden />}

          <span aria-hidden className="hidden md:block" />
        </motion.div>
      </div>
    </section>
  );
}
