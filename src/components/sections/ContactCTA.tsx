import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { copy } from '@/content/copy';

export function ContactCTA() {
  return (
    <section id="contact-cta" className="px-6 py-24 md:py-32">
      <Reveal as="div" className="mx-auto max-w-4xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-quiet">
          {copy.contactCta.eyebrow}
        </p>

        <h2 className="mt-3 font-display text-balance text-4xl font-semibold tracking-tight md:text-6xl">
          {copy.contactCta.headline}
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-ink-soft md:text-lg">
          {copy.contactCta.subhead}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href={copy.contactCta.cta.href} variant="accent" size="lg">
            {copy.contactCta.cta.label}
          </Button>
          <Button
            href={`mailto:${copy.meta.email}`}
            variant="ghost"
            size="lg"
          >
            {copy.meta.email}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
