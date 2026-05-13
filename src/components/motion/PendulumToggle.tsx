'use client';

import { forwardRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';

type PendulumToggleProps = {
  active: boolean;
  onToggle: () => void;
};

export const PendulumToggle = forwardRef<HTMLButtonElement, PendulumToggleProps>(
  function PendulumToggle(
    { active, onToggle },
    ref,
  ) {
    const prefersReduced = useReducedMotion();

    return (
      <motion.button
        ref={ref}
        type="button"
        aria-label={active ? 'Stop pendulum animation' : 'Start pendulum animation'}
        aria-pressed={active}
        data-glow-target
        className={cn(
          'pendulum-toggle group relative flex size-11 items-center justify-center rounded-full border border-line bg-bg-elevated text-ink-quiet shadow-[0_14px_38px_-26px_var(--accent)] outline-none transition-colors focus-visible:border-accent focus-visible:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          active && 'border-line-accent text-accent',
          active && 'pendulum-toggle--active',
        )}
        onClick={onToggle}
        whileHover={prefersReduced ? undefined : { scale: 1.08 }}
        whileTap={prefersReduced ? undefined : { scale: 0.96 }}
      >
        <span
          aria-hidden
          className="absolute inset-[-7px] rounded-full border border-line-accent opacity-0 transition-opacity duration-500 group-hover:opacity-70 group-focus-visible:opacity-70"
        />
        <svg
          aria-hidden
          className="relative size-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 4.5h14"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          <path
            d="M8 4.5v10"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <path
            d="M12 4.5v10"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <path
            d="M16 4.5v10"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <circle
            cx="8"
            cy="17"
            r="2.4"
            fill="currentColor"
          />
          <circle cx="12" cy="17" r="2.4" fill="currentColor" opacity="0.72" />
          <circle
            cx="16"
            cy="17"
            r="2.4"
            fill="currentColor"
          />
        </svg>
      </motion.button>
    );
  },
);
