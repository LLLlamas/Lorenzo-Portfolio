'use client';

import Image from 'next/image';
import { useRef, type MouseEvent } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';
import { cn, withBasePath } from '@/lib/utils';

type Shot = { src: string; alt: string };

type Props = {
  primary: Shot;
  /** Optional second shot — hovering wipes it in from the right. */
  alternate?: Shot | null;
  fit?: 'cover' | 'contain';
  sizes: string;
  priority?: boolean;
  /** Extra classes for the contain-fit padding treatment. */
  containClassName?: string;
};

/**
 * Project cover with two hover behaviors, both driven by the nearest `.group`:
 *  1. Cursor-origin zoom — the shot scales up from wherever the pointer is
 *     (mousemove feeds --zx/--zy into transform-origin).
 *  2. Alternate-shot wipe — when a second image exists it sweeps in from the
 *     right behind an accent seam, like flipping to the next slide.
 * Mouse-only by design; touch and reduced-motion get the static primary.
 */
export function HoverRevealCover({
  primary,
  alternate,
  fit = 'cover',
  sizes,
  priority = false,
  containClassName,
}: Props) {
  const prefersReduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--zx', `${(((e.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`);
    el.style.setProperty('--zy', `${(((e.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`);
  };

  const imgClasses = cn(
    fit === 'cover' && 'object-cover object-top',
    fit === 'contain' && cn('object-contain', containClassName ?? 'p-3 md:p-5'),
  );

  return (
    <div
      ref={ref}
      className="absolute inset-0"
      onMouseMove={onMouseMove}
      style={{ ['--zx' as never]: '50%', ['--zy' as never]: '50%' }}
    >
      {/* Primary — cursor-origin zoom */}
      <div
        className={cn(
          'absolute inset-0',
          !prefersReduced &&
            'transition-transform duration-700 ease-[var(--ease-out-expo)] [transform-origin:var(--zx)_var(--zy)] group-hover:scale-[1.07]',
        )}
      >
        <Image
          src={withBasePath(primary.src)}
          alt={primary.alt}
          fill
          sizes={sizes}
          className={imgClasses}
          priority={priority}
        />
      </div>

      {/* Alternate — wipes in from the right on hover */}
      {alternate && !prefersReduced ? (
        <>
          <div
            aria-hidden
            className="absolute inset-0 transition-[clip-path] duration-[650ms] ease-[var(--ease-out-expo)] [clip-path:inset(0_0_0_100%)] group-hover:[clip-path:inset(0_0_0_0%)]"
          >
            <div className="absolute inset-0 bg-bg-elevated" />
            {/* Incoming shot lags the wipe slightly for depth */}
            <div className="absolute inset-0 translate-x-[5%] transition-transform duration-[650ms] ease-[var(--ease-out-expo)] group-hover:translate-x-0">
              <Image
                src={withBasePath(alternate.src)}
                alt=""
                fill
                sizes={sizes}
                className={imgClasses}
              />
            </div>
          </div>
          {/* Accent seam riding the wipe's leading edge */}
          <span
            aria-hidden
            className="absolute inset-y-0 left-full w-px bg-accent opacity-0 shadow-[0_0_14px_var(--accent)] transition-[left,opacity] duration-[650ms] ease-[var(--ease-out-expo)] group-hover:left-0 group-hover:opacity-100"
          />
        </>
      ) : null}
    </div>
  );
}
