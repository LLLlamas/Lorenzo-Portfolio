'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

type Props = {
  children: ReactNode;
  className?: string;
  color?: string;
};

const DEFAULT_COLOR = 'rgba(255, 255, 255, 0.10)';

export function RippleTap({ children, className, color = DEFAULT_COLOR }: Props) {
  const prefersReduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window);
  }, []);

  useEffect(() => {
    if (prefersReduced || !isTouch) return;
    const node = ref.current;
    if (!node) return;

    const onTouch = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      const rect = node.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = touch.clientX - rect.left - size / 2;
      const y = touch.clientY - rect.top - size / 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-expand';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.background = color;

      const cleanup = () => ripple.remove();
      ripple.addEventListener('animationend', cleanup, { once: true });
      node.appendChild(ripple);
    };

    node.addEventListener('touchstart', onTouch, { passive: true });
    return () => node.removeEventListener('touchstart', onTouch);
  }, [prefersReduced, isTouch, color]);

  if (prefersReduced || !isTouch) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {children}
    </div>
  );
}
