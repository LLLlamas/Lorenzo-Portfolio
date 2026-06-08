'use client';

import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { RippleTap } from '@/components/motion/RippleTap';
import { copy } from '@/content/copy';

export function ContactCTA() {
  return (
    <section id="contact-cta" className="relative px-6 pt-24 pb-64 md:pt-32 md:pb-96">
      {/* Dark scrim behind the text so it reads over the bright daytime building photo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[60%]"
        style={{
          background:
            'linear-gradient(180deg, rgba(6,5,12,0.70) 0%, rgba(6,5,12,0.45) 50%, transparent 100%)',
        }}
      />

      <Reveal as="div" className="relative z-10 mx-auto max-w-4xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-ink-soft [text-shadow:0_1px_8px_rgba(0,0,0,0.95)]">
          {copy.contactCta.eyebrow}
        </p>

        <h2 className="mt-3 font-display text-balance text-4xl font-semibold tracking-tight md:text-6xl [text-shadow:0_2px_20px_rgba(0,0,0,0.95),0_4px_60px_rgba(0,0,0,0.85)]">
          {copy.contactCta.headline}
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-ink md:text-lg [text-shadow:0_1px_12px_rgba(0,0,0,0.95)]">
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
