import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Phone-shaped 9:19.5 container. Centers a portrait screenshot inside
 * a rounded "device display" with subtle shadow so iOS/Android shots
 * look intentional instead of cropped into a landscape card.
 *
 * Caller controls outer height; this component fills it and clamps the
 * inner aspect ratio.
 */
export function PhoneFrame({ children, className }: Props) {
  return (
    <div className={cn('grid h-full place-items-center', className)}>
      <div
        className="relative h-full max-h-full overflow-hidden rounded-[20px] bg-bg-elevated shadow-[0_8px_32px_-12px_rgba(0,0,0,0.35)] ring-1 ring-line/60"
        style={{ aspectRatio: '9 / 19.5' }}
      >
        {children}
      </div>
    </div>
  );
}
