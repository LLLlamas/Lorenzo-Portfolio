import { Globe, Layers, Smartphone } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Stagger } from '@/components/motion/Stagger';
import { copy } from '@/content/copy';

const icons = [Globe, Layers, Smartphone];

export function Capabilities() {
  return (
    <section
      id="capabilities"
      className="border-y border-line bg-bg-elevated px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow={copy.capabilities.eyebrow}
          headline={copy.capabilities.headline}
          subhead={copy.capabilities.subhead}
        />

        <Stagger className="grid gap-6 md:grid-cols-3" step={0.1}>
          {copy.capabilities.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <Card
                key={item.title}
                className="group relative h-full overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md"
              >
                <div className="grid size-10 place-items-center rounded-full bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-110">
                  <Icon className="size-5" aria-hidden />
                </div>

                <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-quiet">
                  {item.kicker}
                </p>

                <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-ink">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm font-medium text-ink-soft">{item.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.body}</p>

                {/* Hairline that draws across on hover */}
                <span
                  aria-hidden
                  className="absolute inset-x-6 bottom-5 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100"
                />
              </Card>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
