'use client';

import { type ReactNode, type MouseEvent } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section';
  shine?: boolean;
};

export function Card({ children, className, as: As = 'div', shine = false }: Props) {
  function handleMouseMove(e: MouseEvent<HTMLElement>) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--shine-x', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty('--shine-y', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }

  function handleMouseLeave(e: MouseEvent<HTMLElement>) {
    e.currentTarget.style.setProperty('--shine-x', '-200%');
    e.currentTarget.style.setProperty('--shine-y', '-200%');
  }

  const El = As as 'div';

  return (
    <El
      className={cn(
        'card-glow rounded-[var(--radius-card)] border border-line bg-bg-elevated',
        shine && 'card-shine',
        className,
      )}
      onMouseMove={shine ? handleMouseMove : undefined}
      onMouseLeave={shine ? handleMouseLeave : undefined}
    >
      {children}
    </El>
  );
}
