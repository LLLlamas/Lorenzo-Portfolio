'use client';

import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';

type Tag = 'div' | 'section' | 'span' | 'li' | 'p' | 'article';

type Props = {
  children: ReactNode;
  as?: Tag;
  className?: string;
  delay?: number;
  /** Distance to translate up from. Default 18px. */
  y?: number;
  /** Margin string for in-view trigger. Default "0px 0px -10% 0px". */
  rootMargin?: string;
  /** Once-only by default — re-trigger if false. */
  once?: boolean;
};

const variants: Variants = {
  hidden: (custom: { y: number }) => ({ opacity: 0, y: custom.y, filter: 'blur(4px)' }),
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

export function Reveal({
  children,
  as = 'div',
  className,
  delay = 0,
  y = 18,
  rootMargin = '0px 0px -10% 0px',
  once = true,
}: Props) {
  const prefersReduced = useReducedMotion();
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  if (prefersReduced) {
    const Tag = as as 'div';
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      custom={{ y }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: rootMargin }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}
