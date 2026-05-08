import { copy } from '@/content/copy';

export function About() {
  return (
    <section id="about" className="px-6 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-quiet">
            {copy.about.eyebrow}
          </p>
        </div>

        <div className="md:col-span-8">
          <div className="space-y-6 text-pretty text-lg leading-relaxed text-ink md:text-xl">
            {copy.about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <blockquote className="mt-12 border-l-2 border-accent pl-6">
            <p className="font-serif text-2xl italic leading-snug text-ink md:text-3xl">
              “{copy.about.pullQuote}”
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
