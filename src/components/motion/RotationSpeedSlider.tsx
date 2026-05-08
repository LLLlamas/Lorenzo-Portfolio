'use client';

import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    __geoSpeed?: number;
  }
}

const MIN = 0;
const MAX = 4;
const DEFAULT = 1;
const STEP = 0.5;

/**
 * Discrete bar control that adjusts the rotation speed of `FloatingGeometry`
 * via a window-level signal (`window.__geoSpeed`) that the geometry's RAF
 * tick reads each frame. No labels, no value readout — just the bar.
 *
 * Hidden on touch devices and under reduced-motion (matches the geometry's
 * own gating; nothing to control if the geometry isn't rendering).
 */
export function RotationSpeedSlider({ className }: { className?: string }) {
  const prefersReduced = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [value, setValue] = useState(DEFAULT);

  useEffect(() => {
    setMounted(true);
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
      setIsTouch(true);
    }
    window.__geoSpeed = DEFAULT;
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.__geoSpeed = value;
  }, [value, mounted]);

  if (!mounted || prefersReduced || isTouch) return null;

  return (
    <div
      className={cn(
        'flex w-32 items-center rounded-full border border-line bg-bg-elevated/85 px-3 py-2 shadow-[0_8px_28px_-18px_rgba(0,0,0,0.45)] backdrop-blur-md',
        className,
      )}
    >
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={STEP}
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        aria-label="Rotation speed"
        className="speed-slider w-full"
      />
    </div>
  );
}
