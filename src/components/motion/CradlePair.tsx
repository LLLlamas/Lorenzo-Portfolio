'use client';

import { useRef, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import { animate } from 'motion';
import { cn } from '@/lib/utils';

type Props = {
  left: ReactNode;
  right: ReactNode;
  className?: string;
};

// Pivot sits above the button — longer "string" = wider arc.
// -80% of element height above the top edge.
const PIVOT = '50% -80%';
const DEG = 22;

export function CradlePair({ left, right, className }: Props) {
  const prefersReduced = useReducedMotion();
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);

  const trigger = async (side: 'left' | 'right') => {
    if (prefersReduced || busy.current) return;
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return;
    busy.current = true;

    const swinger = side === 'left' ? leftRef.current : rightRef.current;
    const receiver = side === 'left' ? rightRef.current : leftRef.current;
    // dir: which direction the swinger pulls back first
    // left pill pulls CCW (away from right), right pill pulls CW
    const dir = side === 'left' ? -1 : 1;

    if (!swinger || !receiver) {
      busy.current = false;
      return;
    }

    try {
      // 1. Pull back — swinger lifts away from center
      await animate(swinger, { rotate: dir * DEG }, {
        duration: 0.22,
        ease: [0.25, 0, 0.5, 1],
      });
      // 2. Swing through — accelerates like a falling pendulum
      await animate(swinger, { rotate: 0 }, {
        duration: 0.18,
        ease: [0.5, 0, 1, 1],
      });
      // 3. Momentum transfers — receiver swings away immediately
      await animate(receiver, { rotate: -dir * DEG }, {
        duration: 0.2,
        ease: [0, 0, 0.4, 1],
      });
      // 4. Receiver swings back with slight overshoot (spring feel)
      await animate(receiver, { rotate: 0 }, {
        duration: 0.55,
        ease: [0.34, 1.4, 0.64, 1],
      });
    } finally {
      busy.current = false;
    }
  };

  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      <div
        ref={leftRef}
        onMouseEnter={() => void trigger('left')}
        style={{ transformOrigin: PIVOT, willChange: 'transform', display: 'inline-block' }}
      >
        {left}
      </div>
      <div
        ref={rightRef}
        onMouseEnter={() => void trigger('right')}
        style={{ transformOrigin: PIVOT, willChange: 'transform', display: 'inline-block' }}
      >
        {right}
      </div>
    </div>
  );
}
