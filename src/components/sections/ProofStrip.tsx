'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { copy } from '@/content/copy';

/**
 * The receipts — four hard numbers that do the price-justifying quietly.
 * Each figure counts up from zero when the strip scrolls into view.
 * Values live in copy.proof and mirror commitments made elsewhere on the
 * site (packages timelines, contact reply window).
 */
export function ProofStrip() {
  const prefersReduced = useReducedMotion();

  return (
    <section aria-label="Track record" className="border-y border-line px-6 py-14 md:py-16">
      <div className="mx-auto max-w-6xl">
        <p className="mb-10">
          <span className="link-bracket text-[11px]">{copy.proof.eyebrow}</span>
        </p>

        <motion.div
          className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
          initial={prefersReduced ? false : 'hidden'}
          whileInView={prefersReduced ? undefined : 'visible'}
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {copy.proof.items.map((item) => (
            <motion.div
              key={item.label}
              className="border-l border-line pl-5"
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              <p className="sr-only">{`${item.prefix}${item.target} ${item.unit} — ${item.label}`}</p>
              <div aria-hidden>
                <p className="font-display text-5xl font-extrabold tracking-tight text-ink md:text-6xl">
                  <span className="text-accent">{item.prefix}</span>
                  <CountUp target={item.target} />
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
                  {item.unit}
                </p>
                <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-ink-soft">
                  {item.label}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/** rAF count-up that fires once when scrolled into view. */
function CountUp({ target, duration = 1400 }: { target: number; duration?: number }) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(prefersReduced ? target : 0);

  useEffect(() => {
    if (prefersReduced) {
      setValue(target);
      return;
    }
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          // ease-out-expo so the last digits settle slowly
          const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
          setValue(Math.round(eased * target));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [duration, prefersReduced, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
    </span>
  );
}
