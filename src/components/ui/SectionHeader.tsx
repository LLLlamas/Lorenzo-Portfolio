import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/motion/Reveal';
import { ScanLine } from '@/components/motion/ScanLine';

type Props = {
  eyebrow?: string;
  headline: ReactNode;
  subhead?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeader({
  eyebrow,
  headline,
  subhead,
  align = 'left',
  className,
}: Props) {
  return (
    <Reveal
      as="div"
      className={cn(
        'mb-12 flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <ScanLine className="mb-4 max-w-[6rem]" />
      {eyebrow ? (
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-quiet">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-balance text-3xl font-semibold tracking-tight md:text-5xl">
        {headline}
      </h2>
      {subhead ? (
        <p className="max-w-2xl text-pretty text-base text-ink-soft md:text-lg">
          {subhead}
        </p>
      ) : null}
    </Reveal>
  );
}
