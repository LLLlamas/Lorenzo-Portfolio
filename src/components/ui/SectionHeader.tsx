import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/motion/Reveal';
import { ScanLine } from '@/components/motion/ScanLine';
import { ScrambleText } from '@/components/motion/ScrambleText';

type Props = {
  eyebrow?: string;
  /** Waypoint number — renders the eyebrow as `[ 0N // Label ]`. */
  index?: number;
  headline: ReactNode;
  subhead?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeader({
  eyebrow,
  index,
  headline,
  subhead,
  align = 'left',
  className,
}: Props) {
  const eyebrowText =
    eyebrow && index != null
      ? `${String(index).padStart(2, '0')} // ${eyebrow}`
      : eyebrow;
  return (
    <Reveal
      as="div"
      className={cn(
        'mb-14 flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <ScanLine className="mb-2 max-w-[6rem]" />
      {eyebrowText ? (
        <p>
          <ScrambleText
            text={eyebrowText}
            className="link-bracket text-[11px]"
            duration={700}
          />
        </p>
      ) : null}
      <h2 className="font-display text-balance text-4xl font-extrabold uppercase leading-[0.95] tracking-[-0.02em] md:text-6xl">
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
