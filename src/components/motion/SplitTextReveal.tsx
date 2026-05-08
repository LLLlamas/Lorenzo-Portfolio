'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import { Fragment, type ReactNode } from 'react';
import { Reveal } from './Reveal';

type Props = {
  text: string;
  className?: string;
  delay?: number;
  /** Stagger step between words in seconds. Default 0.06. */
  step?: number;
  /** "h1" | "h2" | "p" — the wrapping element. */
  as?: 'h1' | 'h2' | 'h3' | 'p';
  /** Optional extra content to render after the split text. */
  trailing?: ReactNode;
};

const containerVariants = (step: number, delay: number): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: step,
      delayChildren: delay,
    },
  },
});

const wordVariants: Variants = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Word-by-word mask reveal. Each word renders inside an overflow-hidden mask;
 * a child span translates from y:110% → y:0%, creating a clean cinematic reveal.
 *
 * Reduced-motion → falls back to a simple Reveal fade-up.
 *
 * Accessibility: visual words are aria-hidden; an sr-only span carries the
 * readable text so screen readers get one clean read instead of word-by-word.
 *
 * No GSAP dependency: Motion + CSS handles the split. GSAP SplitText would
 * buy per-character control we don't need at headline scale, and saves ~25kb.
 */
export function SplitTextReveal({
  text,
  className,
  delay = 0,
  step = 0.06,
  as = 'h1',
  trailing,
}: Props) {
  const prefersReduced = useReducedMotion();
  const Tag = as;

  if (prefersReduced) {
    return (
      <Tag className={className}>
        {text}
        {trailing ? <> {trailing}</> : null}
      </Tag>
    );
  }

  const words = text.split(' ');

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        animate="visible"
        variants={containerVariants(step, delay)}
        className="inline"
      >
        {words.map((word, i) => (
          <Fragment key={i}>
            <span className="split-word">
              <motion.span className="inline-block" variants={wordVariants}>
                {word}
              </motion.span>
            </span>
            {i < words.length - 1 ? ' ' : null}
          </Fragment>
        ))}
        {trailing ? <span className="ml-2 inline-block">{trailing}</span> : null}
      </motion.span>
    </Tag>
  );
}
