import { Fragment } from 'react';
import { copy } from '@/content/copy';

/**
 * Oversized outline-text marquee — the working values scrolling as a section
 * divider. Words render twice for a seamless CSS loop (.marquee-track).
 * Decorative: aria-hidden, and the reduced-motion gate freezes the track.
 */
export function WordMarquee() {
  const words = copy.marquee;

  const sequence = (keyPrefix: string) => (
    <span className="flex shrink-0 items-center" aria-hidden>
      {words.map((word, i) => (
        <Fragment key={`${keyPrefix}-${i}`}>
          <span className="marquee-word px-6 font-display text-[clamp(3rem,7vw,5.5rem)] font-extrabold uppercase leading-none tracking-[-0.02em] md:px-10">
            {word}
          </span>
          <span className="size-2 shrink-0 rotate-45 bg-accent/70" />
        </Fragment>
      ))}
    </span>
  );

  return (
    <div
      className="overflow-hidden border-y border-line py-8 md:py-10"
      aria-hidden
    >
      <div className="marquee-track motion-decorative flex w-max items-center">
        {sequence('a')}
        {sequence('b')}
      </div>
    </div>
  );
}
