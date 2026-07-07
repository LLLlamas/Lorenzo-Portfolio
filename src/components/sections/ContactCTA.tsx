'use client';

import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { RippleTap } from '@/components/motion/RippleTap';
import { ScrambleText } from '@/components/motion/ScrambleText';
import { copy } from '@/content/copy';

export function ContactCTA() {
  return (
    <section id="contact-cta" className="relative px-6 py-28 md:py-40">
      {/* Accent radial — a single warm pool of light in the void */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(48rem 30rem at 50% 45%, var(--accent-soft) 0%, transparent 72%)',
        }}
      />

      <Reveal as="div" className="relative z-10 mx-auto max-w-4xl text-center">
        <p>
          <ScrambleText
            text={copy.contactCta.eyebrow}
            className="link-bracket text-[11px]"
            duration={700}
          />
        </p>

        <h2 className="mt-5 font-display text-balance text-4xl font-extrabold uppercase leading-[0.95] tracking-[-0.02em] md:text-7xl">
          {copy.contactCta.headline}
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-pretty text-base text-ink-soft md:text-lg">
          {copy.contactCta.subhead}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <RippleTap className="rounded-full">
            <Button href={copy.contactCta.cta.href} variant="accent" size="lg">
              {copy.contactCta.cta.label}
            </Button>
          </RippleTap>
          <RippleTap className="rounded-full">
            <Button
              href={`mailto:${copy.meta.email}`}
              variant="ghost"
              size="lg"
            >
              {copy.meta.email}
            </Button>
          </RippleTap>
        </div>
      </Reveal>
    </section>
  );
}
