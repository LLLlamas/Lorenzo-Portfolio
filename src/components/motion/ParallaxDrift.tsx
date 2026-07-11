'use client';

import { useRef, type ReactNode } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react';

type Props = {
  children: ReactNode;
  className?: string;
  /** Pixel drift as the wrapper crosses the viewport: starts at `from`, ends at `to`. */
  from?: number;
  to?: number;
};

/**
 * Scroll-linked vertical drift. Wrap any decorative layer (watermark numbers,
 * ghost indexes, floating plates) to give it its own depth plane against the
 * page scroll. Static under reduced motion.
 */
export function ParallaxDrift({ children, className, from = 48, to = -48 }: Props) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [from, to]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={prefersReduced ? undefined : { y }}
    >
      {children}
    </motion.div>
  );
}
