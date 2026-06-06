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
        <p className="aura-pop text-sm font-bold uppercase tracking-[0.18em] text-ink-quiet">
          <span className="label-select">{eyebrow}</span>
        </p>
      ) : null}
      <h2 className="font-display text-balance text-3xl font-semibold tracking-tight md:text-5xl [text-shadow:0_2px_14px_rgba(16,15,28,0.85),0_4px_40px_rgba(16,15,28,0.6)]">
        {headline}
      </h2>
      {subhead ? (
        <p className="max-w-2xl text-pretty text-base text-ink-soft md:text-lg [text-shadow:0_1px_8px_rgba(16,15,28,0.9)]">
          {subhead}
        </p>
      ) : null}
    </Reveal>
  );
}
