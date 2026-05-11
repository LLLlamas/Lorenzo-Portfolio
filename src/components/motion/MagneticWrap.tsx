'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

type Props = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

const TOUCH_QUERY = '(hover: none)';

export function MagneticWrap({ children, className, strength = 0.25 }: Props) {
  const prefersReduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReduced) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia(TOUCH_QUERY).matches) return;

    const node = ref.current;
    if (!node) return;

    const onMove = (event: MouseEvent) => {
      const rect = node.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (event.clientX - cx) * strength;
      const dy = (event.clientY - cy) * strength;
      node.style.transition = 'transform 0.1s ease-out';
      node.style.transform = `translate(${dx}px, ${dy}px)`;
    };

    const onLeave = () => {
      node.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      node.style.transform = 'translate(0, 0)';
    };

    node.addEventListener('mousemove', onMove);
    node.addEventListener('mouseleave', onLeave);

    return () => {
      node.removeEventListener('mousemove', onMove);
      node.removeEventListener('mouseleave', onLeave);
    };
  }, [prefersReduced, strength]);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{ display: 'inline-block', willChange: 'transform' }}
    >
      {children}
    </div>
  );
}
