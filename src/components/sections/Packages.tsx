import { Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Stagger } from '@/components/motion/Stagger';
import { Reveal } from '@/components/motion/Reveal';
import { copy } from '@/content/copy';
import { packages, modifiers } from '@/content/packages';
import { cn } from '@/lib/utils';

export function Packages() {
  return (
    <section id="packages" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow={copy.packages.eyebrow}
          headline={copy.packages.headline}
          subhead={copy.packages.subhead}
        />

        <Stagger className="grid gap-6 md:grid-cols-2" step={0.12}>
          {packages.map((pkg) => (
            <Card
              key={pkg.name}
              className={cn(
                'group relative p-7 transition-all duration-300 md:p-8',
                pkg.popular &&
                  'border-accent/40 shadow-[0_0_0_1px_var(--accent-soft)] ring-1 ring-accent/20',
              )}
            >
              {pkg.popular ? (
                <span className="soft-pulse motion-decorative absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent-on">
                  Most projects land here
                </span>
              ) : null}

              <div className="flex items-baseline justify-between gap-4">
                <h3
                  className="cascade-step cascade-1 font-display text-2xl font-semibold tracking-tight text-ink"
                  style={{ transitionDelay: '0ms' }}
                >
                  {pkg.name}
                </h3>
                <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink-quiet">
                  {pkg.cadence}
                </span>
              </div>

              <p
                className="cascade-step cascade-2 mt-1 text-sm text-ink-soft"
                style={{ transitionDelay: '80ms' }}
              >
                {pkg.description}
              </p>

              <p
                className="cascade-step cascade-1 mt-6 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl"
                style={{ transitionDelay: '160ms' }}
              >
                {pkg.price}
              </p>

              <ul className="mt-6 space-y-2.5 text-sm text-ink-soft">
                {pkg.features.map((feat, i) => (
                  <li key={feat} className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                    <span
                      className="cascade-step cascade-2 leading-relaxed"
                      style={{ transitionDelay: `${240 + i * 40}ms` }}
                    >
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <Button
                  href="/contact"
                  variant={pkg.popular ? 'accent' : 'primary'}
                  className="cascade-step cascade-1 w-full"
                  style={{ transitionDelay: `${240 + pkg.features.length * 40}ms` }}
                >
                  Start a {pkg.name} project
                </Button>
              </div>
            </Card>
          ))}
        </Stagger>

        <Reveal as="div" className="mt-10 rounded-[var(--radius-card)] border border-line bg-bg-elevated p-6 md:p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-quiet">
            Modifiers
          </p>
          <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm md:grid-cols-2">
            {modifiers.map((mod) => (
              <div
                key={mod.label}
                className="flex items-center justify-between gap-4 border-b border-line pb-3 last:border-b-0 md:last:border-b last:[&:nth-last-child(-n+1)]:border-b-0"
              >
                <dt className="text-ink">{mod.label}</dt>
                <dd className="font-mono text-xs text-ink-soft">{mod.adjustment}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
