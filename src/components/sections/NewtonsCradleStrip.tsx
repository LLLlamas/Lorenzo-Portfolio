'use client';

import {
  useMemo,
  type RefCallback,
  type RefObject,
} from 'react';
import { techStackItems } from '@/content/tech-stack';
import { cn } from '@/lib/utils';

type NewtonsCradleStripProps = {
  active: boolean;
  itemRefs: RefObject<Array<HTMLLIElement | null>>;
};

export function NewtonsCradleStrip({
  active,
  itemRefs,
}: NewtonsCradleStripProps) {
  const setItemRef = useMemo(
    () =>
      techStackItems.map(
        (_, index): RefCallback<HTMLLIElement> =>
          (node) => {
            itemRefs.current[index] = node;
          },
      ),
    [itemRefs],
  );

  return (
    <div
      className={cn(
        'relative border-y border-line px-6 py-5',
        active && 'cradle-strip-active',
      )}
    >
      <ul
        aria-label="Core technologies"
        className="relative z-10 mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-10 gap-y-3"
      >
        {techStackItems.map((item, index) => (
          <li
            key={item}
            ref={setItemRef[index]}
            className={cn(
              'pendulum-label aura-pop whitespace-nowrap text-sm font-bold uppercase tracking-[0.16em] text-ink-quiet',
              index === 0 && 'pendulum-label--left',
              index > 0 && index < techStackItems.length - 1 && 'pendulum-label--middle',
              index === techStackItems.length - 1 && 'pendulum-label--right',
              active && 'pendulum-label--active',
            )}
          >
            <span className="label-select">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
