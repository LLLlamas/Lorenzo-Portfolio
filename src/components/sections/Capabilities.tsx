'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { copy } from '@/content/copy';
import { cn } from '@/lib/utils';

/**
 * Editorial capability index — numbered full-width rows divided by hairlines.
 * Hover offsets a ghost duplicate of the title (misregistered print pass);
 * click/Enter expands the row to reveal body copy + mono stack tags.
 */
export function Capabilities() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section
      id="capabilities"
      className="section-glass border-y px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow={copy.capabilities.eyebrow}
          index={3}
          headline={copy.capabilities.headline}
          subhead={copy.capabilities.subhead}
        />

        <div className="border-t border-line">
          {copy.capabilities.items.map((item, i) => {
            const isOpen = selected === i;
            return (
              <motion.div
                key={item.title}
                className="border-b border-line"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  type="button"
                  onClick={() => setSelected(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="capability-row group relative grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-baseline gap-x-5 py-7 text-left outline-none transition-[padding] duration-500 ease-[var(--ease-out-expo)] focus-visible:bg-white/[0.03] hover:pl-4 md:gap-x-10 md:py-9 md:hover:pl-6"
                >
                  {/* Accent bar draws up the row's left edge on hover */}
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-0 top-0 w-[3px] origin-bottom scale-y-0 bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100"
                  />
                  <span className="font-mono text-xs text-accent md:text-sm">
                    0{i + 1}/
                  </span>

                  <div className="min-w-0">
                    <h3
                      className="ghost-title font-display text-2xl font-extrabold uppercase leading-none tracking-tight text-ink transition-colors duration-300 md:text-4xl"
                      data-text={item.title}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-ink-soft md:text-base">
                      {item.tagline}
                    </p>
                  </div>

                  <span className="flex items-center gap-3 self-center">
                    <span
                      className={cn(
                        'grid size-9 place-items-center rounded-full border border-line text-ink-quiet transition-[transform,border-color,color] duration-300',
                        'group-hover:border-accent group-hover:text-accent',
                        isOpen && 'rotate-45 border-accent text-accent',
                      )}
                    >
                      <ArrowUpRight aria-hidden className="size-4" />
                    </span>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      key="detail"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{
                        opacity: 1,
                        height: 'auto',
                        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                      }}
                      exit={{ opacity: 0, height: 0, transition: { duration: 0.22 } }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 pb-9 pl-9 pr-2 md:grid-cols-[1.4fr_1fr] md:pl-[4.5rem]">
                        <p className="max-w-xl text-sm leading-relaxed text-ink-soft md:text-base">
                          {item.body}
                        </p>
                        <div className="flex flex-wrap content-start gap-x-4 gap-y-2 md:justify-end">
                          {item.tags.map((tag, j) => (
                            <motion.span
                              key={tag}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{
                                opacity: 1,
                                y: 0,
                                transition: {
                                  duration: 0.3,
                                  delay: j * 0.04,
                                  ease: [0.16, 1, 0.3, 1],
                                },
                              }}
                              className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent"
                            >
                              {tag}
                              {j < item.tags.length - 1 ? (
                                <span className="ml-4 text-line">/</span>
                              ) : null}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
