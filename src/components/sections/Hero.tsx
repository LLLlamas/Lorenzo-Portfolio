'use client';

import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'motion/react';
import { Button } from '@/components/ui/Button';
import { SplitTextReveal } from '@/components/motion/SplitTextReveal';
import { copy } from '@/content/copy';

const FloatingGeometry = dynamic(
  () =>
    import('@/components/motion/FloatingGeometry').then(
      (m) => m.FloatingGeometry,
    ),
  { ssr: false },
);

export function Hero() {
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

      {/* Floating tetrahedron — sits behind copy, far right */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-[-4%] top-1/4 -z-10 hidden size-[420px] md:block lg:size-[560px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <FloatingGeometry className="h-full w-full" />
      </motion.div>

      <div className="mx-auto max-w-5xl">
        <motion.p
          className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-quiet"
          initial={prefersReduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {copy.hero.eyebrow}
        </motion.p>

        <SplitTextReveal
          as="h1"
          className="font-display text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl"
          text={copy.hero.headline}
          delay={0.3}
          step={0.06}
        />

        <motion.p
          className="mt-6 max-w-2xl text-pretty text-lg text-ink-soft md:text-xl"
          initial={prefersReduced ? false : { opacity: 0, y: 12, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.9, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
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
              transition: { staggerChildren: 0.08, delayChildren: 1.05 },
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
                variant={i === 0 ? 'accent' : 'ghost'}
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
