import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/motion/Reveal';
import { ScanLine } from '@/components/motion/ScanLine';
import { ScrambleText } from '@/components/motion/ScrambleText';
import { SplitTextReveal } from '@/components/motion/SplitTextReveal';

type Props = {
  eyebrow?: string;
  /** Waypoint number — renders the eyebrow as `[ 0N // Label ]` and a giant outline watermark. */
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
  const indexLabel = index != null ? String(index).padStart(2, '0') : null;
  const eyebrowText =
    eyebrow && indexLabel ? `${indexLabel} // ${eyebrow}` : eyebrow;

  return (
    <Reveal
      as="div"
      className={cn(
        'relative mb-14 flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {indexLabel ? (
        <span aria-hidden className="section-watermark">
          {indexLabel}
        </span>
      ) : null}
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
      {typeof headline === 'string' ? (
        <SplitTextReveal
          as="h2"
          inView
          step={0.05}
          text={headline}
          className="font-display text-balance text-4xl font-extrabold uppercase leading-[0.95] tracking-[-0.02em] md:text-6xl"
        />
      ) : (
        <h2 className="font-display text-balance text-4xl font-extrabold uppercase leading-[0.95] tracking-[-0.02em] md:text-6xl">
          {headline}
        </h2>
      )}
      {subhead ? (
        <p className="max-w-2xl text-pretty text-base text-ink-soft md:text-lg">
          {subhead}
        </p>
      ) : null}
    </Reveal>
  );
}
