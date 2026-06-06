'use client';

import { useState } from 'react';
import { Globe, Layers, Smartphone } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { RippleTap } from '@/components/motion/RippleTap';
import { copy } from '@/content/copy';
import { cn } from '@/lib/utils';

const icons = [Globe, Layers, Smartphone];

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
          headline={copy.capabilities.headline}
          subhead={copy.capabilities.subhead}
        />

        <motion.div
          className="grid gap-6 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {copy.capabilities.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <RippleTap key={item.title} className="rounded-[var(--radius-card)]">
              <motion.article
                onClick={() => setSelected(selected === i ? null : i)}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(selected === i ? null : i); } }}
                variants={{
                  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className={cn(
                  'card-glow group relative h-full cursor-pointer overflow-hidden rounded-[var(--radius-card)] border border-line bg-bg p-6 outline-none',
                  'transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-out-expo)]',
                  'hover:-translate-y-2 hover:shadow-[0_12px_40px_-12px_var(--accent)]',
                  'focus-visible:ring-2 focus-visible:ring-accent',
                  selected === i && 'ring-2 ring-accent/60 border-accent/50 shadow-[0_0_0_1px_var(--accent-soft),0_0_20px_-4px_var(--accent)]',
                )}
                style={{ willChange: 'transform' }}
              >
                <div className="grid size-10 place-items-center rounded-full bg-accent-soft text-accent transition-[transform] duration-300 group-hover:scale-110">
                  <Icon className="size-5" aria-hidden />
                </div>

                {item.kicker ? (
                  <p className="aura-pop mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-ink-quiet">
                    <span className="label-select">{item.kicker}</span>
                  </p>
                ) : null}

                <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-ink">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm font-medium text-ink-soft">{item.tagline}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.body}</p>

                {/* Mobile: pills revealed inside the card on click */}
                <AnimatePresence>
                  {selected === i ? (
                    <motion.div
                      key="mobile-pills"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
                      exit={{ opacity: 0, height: 0, transition: { duration: 0.18 } }}
                      className="mt-4 flex flex-wrap gap-1.5 md:hidden"
                      aria-hidden
                    >
                      {item.tags.map((tag, j) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.3, delay: j * 0.04, ease: [0.16, 1, 0.3, 1] } }}
                          className="pill-tag rounded-full border border-line-accent bg-bg/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-accent"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                {/* Hairline that draws across on hover */}
                <span
                  aria-hidden
                  className="absolute inset-x-6 bottom-5 h-px origin-left scale-x-0 bg-accent transition-[transform] duration-300 group-hover:scale-x-100"
                />
                {/* Down-arrow hint */}
                <span
                  aria-hidden
                  className={cn(
                    'absolute bottom-[14px] left-1/2 -translate-x-1/2 size-0 transition-[opacity] duration-200',
                    selected === i ? 'opacity-0' : 'opacity-50 group-hover:opacity-100',
                  )}
                  style={{
                    borderLeft: '4px solid transparent',
                    borderRight: '4px solid transparent',
                    borderTop: '5px solid var(--accent)',
                  }}
                />
              </motion.article>
              </RippleTap>
            );
          })}
        </motion.div>

        {/* Tech pills row */}
        <div
          className="mt-6 hidden md:grid md:min-h-[3.5rem] md:gap-6 md:grid-cols-3"
          aria-hidden
        >
          {copy.capabilities.items.map((item, i) => (
            <div key={item.title} className="flex flex-wrap items-start gap-1.5">
              <AnimatePresence>
                {selected === i
                  ? item.tags.map((tag, j) => (
                      <motion.span
                        key={tag}
                        initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          filter: 'blur(0px)',
                          transition: {
                            duration: 0.35,
                            delay: j * 0.045,
                            ease: [0.16, 1, 0.3, 1],
                          },
                        }}
                        exit={{
                          opacity: 0,
                          y: -4,
                          filter: 'blur(2px)',
                          transition: { duration: 0.18 },
                        }}
                        className="pill-tag rounded-full border border-line-accent bg-bg/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-accent"
                      >
                        {tag}
                      </motion.span>
                    ))
                  : null}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
