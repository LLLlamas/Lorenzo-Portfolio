import { SectionHeader } from '@/components/ui/SectionHeader';
import { Stagger } from '@/components/motion/Stagger';
import { copy } from '@/content/copy';
import { faqs } from '@/content/faqs';

export function FAQ() {
  return (
    <section id="faq" className="section-glass border-t px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <SectionHeader eyebrow={copy.faq.eyebrow} index={5} headline={copy.faq.headline} />

        <Stagger
          as="ul"
          childAs="li"
          className="divide-y divide-line border-y border-line"
          step={0.06}
        >
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              {/* list-none + marker overrides kill the native disclosure arrow —
                  the rotating plus circle is the single expand affordance */}
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-left font-display text-base font-medium text-ink marker:content-none [&::-webkit-details-marker]:hidden md:text-lg">
                <span className="text-pretty">{faq.question}</span>
                <span
                  aria-hidden
                  className="grid size-6 shrink-0 place-items-center rounded-full border border-line text-ink-soft transition-transform group-open:rotate-45"
                >
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 1V9M1 5H9"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-ink-soft md:text-base">
                {faq.answer}
              </p>
            </details>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
