import { Reveal } from '@/components/motion/Reveal';
import { Stagger } from '@/components/motion/Stagger';
import { SignalResolve } from '@/components/motion/SignalResolve';
import { copy } from '@/content/copy';

export function About() {
  return (
    <section id="about" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12">
        <Reveal as="div" className="md:col-span-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-quiet">
            {copy.about.eyebrow}
          </p>
        </Reveal>

        <div className="md:col-span-8">
          <Stagger
            className="space-y-6 text-pretty text-lg leading-relaxed text-ink md:text-xl"
            step={0.1}
          >
            {copy.about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Stagger>

          <Reveal as="div" delay={0.2}>
            <blockquote className="mt-12 border-l-2 border-accent pl-6">
              <p className="font-display text-2xl leading-snug text-ink md:text-3xl">
                <span className="text-accent">&ldquo;</span>
                <SignalResolve text={copy.about.pullQuote} delay={0.15} />
                <span className="text-accent">&rdquo;</span>
              </p>
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
