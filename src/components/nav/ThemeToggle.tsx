'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === 'dark';
  const next = isDark ? 'light' : 'dark';

  return (
    <button
      type="button"
      data-theme-toggle
      aria-label={mounted ? `Switch to ${next} mode` : 'Toggle theme'}
      onClick={() => setTheme(next)}
      className="group grid size-9 place-items-center rounded-full border border-line text-ink-soft hover:text-accent"
    >
      <svg
        viewBox="0 0 16 16"
        width="16"
        height="16"
        fill="none"
        aria-hidden
        className={cn(
          'transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
          isDark ? 'rotate-0' : 'rotate-180',
        )}
      >
        {/* Tetrahedron outline — three visible edges of a tetra projected
            so it reads as a polygon. Rotates 180° on phase switch. */}
        <path
          d="M8 1.5 L14 13.2 L2 13.2 Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M8 1.5 L8 13.2"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
          opacity="0.55"
        />
      </svg>
    </button>
  );
}
