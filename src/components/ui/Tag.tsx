import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Tag({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      style={style}
      className={cn(
        'pill-tag inline-flex items-center rounded-[var(--radius-pill)] border border-line bg-bg px-2.5 py-0.5 text-[10px] uppercase tracking-[0.08em] text-ink-soft',
        className,
      )}
    >
      {children}
    </span>
  );
}
