import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Tag({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[var(--radius-pill)] border border-line bg-bg px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-soft',
        className,
      )}
    >
      {children}
    </span>
  );
}
