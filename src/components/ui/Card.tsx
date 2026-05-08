import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'section';
};

export function Card({ children, className, as: As = 'div' }: Props) {
  return (
    <As
      className={cn(
        'rounded-[var(--radius-card)] border border-line bg-bg-elevated',
        className,
      )}
    >
      {children}
    </As>
  );
}
