import { Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
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

        <div className="grid gap-6 md:grid-cols-2">
          {packages.map((pkg) => (
            <Card
              key={pkg.name}
              className={cn(
                'relative p-7 md:p-8',
                pkg.popular && 'border-accent/40 ring-1 ring-accent/20',
              )}
            >
              {pkg.popular ? (
                <span className="absolute -top-3 left-7 rounded-full bg-accent px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent-on">
                  Most projects land here
                </span>
              ) : null}

              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">
                  {pkg.name}
                </h3>
                <span className="font-mono text-xs uppercase tracking-[0.12em] text-ink-quiet">
                  {pkg.cadence}
                </span>
              </div>

              <p className="mt-1 text-sm text-ink-soft">{pkg.description}</p>

              <p className="mt-6 font-display text-2xl font-semibold tracking-tight text-ink md:text-3xl">
                {pkg.price}
              </p>

              <ul className="mt-6 space-y-2.5 text-sm text-ink-soft">
                {pkg.features.map((feat) => (
                  <li key={feat} className="flex gap-3">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                    <span className="leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-7">
                <Button
                  href="/contact"
                  variant={pkg.popular ? 'accent' : 'primary'}
                  className="w-full"
                >
                  Start a {pkg.name} project
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-[var(--radius-card)] border border-line bg-bg-elevated p-6 md:p-8">
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
        </div>
      </div>
    </section>
  );
}
