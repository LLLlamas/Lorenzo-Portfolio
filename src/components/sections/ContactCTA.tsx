'use client';

import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { RippleTap } from '@/components/motion/RippleTap';
import { ScrambleText } from '@/components/motion/ScrambleText';
import { copy } from '@/content/copy';

export function ContactCTA() {
  return (
    <section id="contact-cta" className="relative overflow-hidden px-6 py-28 md:py-40">
      {/* Arrival glow — a breathing light source rising past the horizon,
          the destination the whole scroll journey has been descending toward */}
      <div
        aria-hidden
        className="sun-breathe motion-decorative pointer-events-none absolute inset-x-0 bottom-0 h-[70%]"
        style={{
          background:
            'radial-gradient(64rem 28rem at 50% 108%, color-mix(in srgb, var(--accent) 42%, transparent) 0%, color-mix(in srgb, var(--accent) 15%, transparent) 45%, transparent 76%)',
        }}
      />
      {/* Horizon hairline the glow bleeds over */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 45%, transparent) 50%, transparent)',
        }}
      />

      <Reveal as="div" className="relative z-10 mx-auto max-w-4xl text-center">
        <p>
          <ScrambleText
            text={`06 // ${copy.contactCta.eyebrow}`}
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
