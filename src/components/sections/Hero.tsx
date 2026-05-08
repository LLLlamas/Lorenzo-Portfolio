import { Button } from '@/components/ui/Button';
import { copy } from '@/content/copy';

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden px-6 pb-24 pt-32 md:pt-44"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-[680px] -translate-x-1/2 rounded-full bg-accent-soft/60 blur-3xl"
      />

      <div className="mx-auto max-w-5xl">
        <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-quiet">
          {copy.hero.eyebrow}
        </p>

        <h1 className="font-display text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
          {copy.hero.headline}
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-lg text-ink-soft md:text-xl">
          {copy.hero.subhead}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href={copy.hero.primaryCta.href} variant="primary" size="lg">
            {copy.hero.primaryCta.label}
          </Button>
          <Button href={copy.hero.secondaryCta.href} variant="ghost" size="lg">
            {copy.hero.secondaryCta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
