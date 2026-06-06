import { Reveal } from '@/components/motion/Reveal';
import { Stagger } from '@/components/motion/Stagger';
import { copy } from '@/content/copy';

export function About() {
  return (
    <section id="about" className="relative px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <Reveal as="div" className="mb-10">
          <p className="aura-pop text-sm font-bold uppercase tracking-[0.18em] text-ink-quiet">
            <span className="label-select">{copy.about.eyebrow}</span>
          </p>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-12 md:gap-14">
          <Reveal as="div" className="md:col-span-5">
            <div className="relative">
              <AboutPlaceholder />
              {/* Floating skill badges — decorative, hidden on mobile */}
              <span className="floating-chip floating-chip-1 pointer-events-none absolute -right-5 top-8 hidden items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-1.5 text-xs font-semibold text-ink shadow-sm md:flex">
                <span className="inline-block size-1.5 rounded-full bg-accent" aria-hidden />
                Next.js
              </span>
              <span className="floating-chip floating-chip-2 pointer-events-none absolute -left-5 top-[38%] hidden items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-1.5 text-xs font-semibold text-ink shadow-sm md:flex">
                <span className="inline-block size-1.5 rounded-full bg-accent-secondary" aria-hidden />
                SwiftUI
              </span>
              <span className="floating-chip floating-chip-3 pointer-events-none absolute -right-5 bottom-[30%] hidden items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-1.5 text-xs font-semibold text-ink shadow-sm md:flex">
                <span className="inline-block size-1.5 rounded-full bg-accent" aria-hidden />
                TypeScript
              </span>
              <span className="floating-chip floating-chip-4 pointer-events-none absolute -bottom-4 left-[20%] hidden items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-1.5 text-xs font-semibold text-ink shadow-sm md:flex">
                <span className="inline-block size-1.5 rounded-full bg-accent-secondary" aria-hidden />
                GSAP
              </span>
            </div>
          </Reveal>

          <div className="md:col-span-7">
            <Stagger
              className="space-y-6 text-pretty text-lg leading-relaxed text-ink md:text-xl"
              step={0.1}
            >
              {copy.about.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </Stagger>

            <Reveal as="div" delay={0.2}>
              <blockquote className="mt-10 border-l-2 border-accent pl-6">
                <p className="font-serif text-2xl italic leading-snug text-ink md:text-3xl">
                  &ldquo;{copy.about.pullQuote}&rdquo;
                </p>
              </blockquote>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Placeholder portrait — a tasteful CSS card with the subject's monogram.
 * Drop a real photo at /public/about/portrait.{jpg,webp} and replace with
 * a `next/image` once available; the layout is sized to match a portrait
 * 4:5 ratio so swapping won't reflow.
 */
function AboutPlaceholder() {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-bg-elevated shadow-[0_30px_80px_-50px_var(--accent)]">
      {/* Soft layered gradient — feels like a frame, not a missing asset */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 80% at 30% 0%, var(--accent-soft) 0%, transparent 60%), radial-gradient(140% 100% at 80% 100%, var(--accent-secondary-soft) 0%, transparent 65%)',
        }}
      />

      {/* Hairline grid */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Monogram + label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
        <span
          className="font-serif text-[120px] leading-none tracking-tight text-accent md:text-[160px]"
          aria-hidden
        >
          LL
        </span>
        <span className="text-xs font-bold uppercase tracking-[0.32em] text-ink-quiet">
          Portrait — coming soon
        </span>
      </div>

      {/* Bottom hairline accent */}
      <span
        aria-hidden
        className="absolute inset-x-6 bottom-5 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />
    </div>
  );
}
