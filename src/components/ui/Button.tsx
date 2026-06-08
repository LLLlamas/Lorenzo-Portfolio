import Link from 'next/link';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost' | 'accent';
type Size = 'md' | 'lg';

const base =
  'btn-sweep group inline-flex items-center justify-center rounded-full border font-medium tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  // Primary: dark-glass pill → accent sweep on hover
  primary:
    'border-white/35 bg-black/45 text-ink backdrop-blur-md hover:border-white/55 hover:text-ink hover:shadow-[0_0_24px_-6px_var(--accent)]',
  // Ghost: dark-glass clear pill — reads over any city backdrop
  ghost:
    'border-white/50 bg-black/40 text-ink backdrop-blur-md hover:border-white/70 hover:bg-black/55',
  // Accent: dark-glass accent-tinted pill → solid accent sweep + glow on hover
  accent:
    'border-accent/80 bg-black/45 text-accent backdrop-blur-md hover:border-accent hover:text-accent-on hover:shadow-[0_0_32px_-4px_var(--accent),0_0_60px_-24px_var(--accent)]',
};

const sweepStyles: Record<Variant, CSSProperties> = {
  primary: { ['--sweep-bg' as never]: 'var(--accent)' },
  ghost: { ['--sweep-bg' as never]: 'rgba(255,255,255,0.10)' },
  accent: { ['--sweep-bg' as never]: 'var(--accent)' },
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
