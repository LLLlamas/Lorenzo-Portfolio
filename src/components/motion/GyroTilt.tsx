'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/lib/use-prefers-reduced-motion';

type Props = {
  children: ReactNode;
  className?: string;
};

type IOSDeviceOrientationEvent = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function GyroTilt({ children, className }: Props) {
  const prefersReduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window);
  }, []);

  useEffect(() => {
    if (prefersReduced || !isTouch) return;
    const node = ref.current;
    if (!node) return;

    const onOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta == null || event.gamma == null) return;
      const tiltX = clamp(event.beta * 0.15, -12, 12);
      const tiltY = clamp(event.gamma * 0.25, -12, 12);
      node.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    };

    let attached = false;
    const attach = () => {
      if (attached) return;
      attached = true;
      window.addEventListener('deviceorientation', onOrientation);
    };

    // iOS 13+ requires permission to be requested from a user gesture.
    // Other platforms expose the event directly.
    const Ctor = DeviceOrientationEvent as IOSDeviceOrientationEvent;
    const needsPermission = typeof Ctor?.requestPermission === 'function';

    const onFirstTouch = () => {
      Ctor.requestPermission!()
        .then((state) => {
          if (state === 'granted') attach();
        })
        .catch(() => {
          /* user denied — silently no-op */
        });
    };

    if (needsPermission) {
      window.addEventListener('touchstart', onFirstTouch, { once: true, passive: true });
    } else {
      attach();
    }

    return () => {
      window.removeEventListener('deviceorientation', onOrientation);
      window.removeEventListener('touchstart', onFirstTouch);
    };
  }, [prefersReduced, isTouch]);

  if (prefersReduced || !isTouch) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: 'transform 0.08s linear',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
