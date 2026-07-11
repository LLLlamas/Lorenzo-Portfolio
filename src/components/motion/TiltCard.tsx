'use client';

import { useRef, type ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'motion/react';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  className?: string;
  /** Max lean toward the cursor, in degrees. */
  maxTilt?: number;
  /** Scale applied while the pointer is over the card. */
  hoverScale?: number;
};

const SPRING = { stiffness: 220, damping: 24, mass: 0.6 };

/**
 * Pointer-tracked 3D tilt plate. The card leans toward the cursor on a
 * spring, lifts a hair, and feeds `--shine-x` / `--shine-y` so `.card-shine`
 * children paint a moving light source. Mouse-only — touch pointers and
 * reduced motion get a plain wrapper.
 */
export function TiltCard({
  children,
  className,
  maxTilt = 5,
  hoverScale = 1.012,
}: Props) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  // Normalized pointer position inside the card (0..1, resting at center)
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(
    useTransform(py, [0, 1], [maxTilt, -maxTilt]),
    SPRING,
  );
  const rotateY = useSpring(
    useTransform(px, [0, 1], [-maxTilt, maxTilt]),
    SPRING,
  );

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    px.set(x / rect.width);
    py.set(y / rect.height);
    node.style.setProperty('--shine-x', `${x}px`);
    node.style.setProperty('--shine-y', `${y}px`);
  };

  const handlePointerLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      className={cn('will-change-transform', className)}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      whileHover={{ scale: hoverScale }}
      transition={{ type: 'spring', ...SPRING }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </motion.div>
  );
}
