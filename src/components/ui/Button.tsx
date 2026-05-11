import Link from 'next/link';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost' | 'accent';
type Size = 'md' | 'lg';

const base =
  'btn-sweep btn-pendulum group inline-flex items-center justify-center rounded-full border font-medium tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  // Primary: ink fill → sweeps to accent on hover, text inverts to accent-on
  primary: 'border-ink bg-ink text-bg hover:text-accent-on hover:border-accent',
  // Ghost: transparent → sweeps to accent on hover, text inverts to accent-on
  ghost: 'border-line bg-transparent text-ink hover:text-accent-on hover:border-accent',
  // Accent: bg accent → sweeps to ink on hover, text inverts to bg
  accent: 'border-accent bg-accent text-accent-on hover:text-bg hover:border-ink',
};

const sweepStyles: Record<Variant, CSSProperties> = {
  primary: { ['--sweep-bg' as never]: 'var(--accent)' },
  ghost: { ['--sweep-bg' as never]: 'var(--accent)' },
  accent: { ['--sweep-bg' as never]: 'var(--ink)' },
};

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[15px]',
};

type Props = {
  variant?: Variant;
  size?: Size;
  href?: string;
  className?: string;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  className,
  style: externalStyle,
  children,
  ...rest
}: Props) {
  const cls = cn(base, variants[variant], sizes[size], className);
  const style = { ...sweepStyles[variant], ...externalStyle };

  if (href) {
    const isExternal = /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a href={href} className={cls} style={style} target="_blank" rel="noreferrer noopener">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={cls} style={style} {...rest}>
      {children}
    </button>
  );
}
