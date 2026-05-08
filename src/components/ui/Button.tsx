import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'ghost' | 'accent';
type Size = 'md' | 'lg';

const base =
  'btn-glow inline-flex items-center justify-center rounded-full font-mono uppercase tracking-[0.16em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'border border-accent bg-accent text-accent-on hover:bg-transparent hover:text-accent',
  ghost: 'border border-line bg-transparent text-ink hover:border-line-accent hover:text-accent',
  accent: 'border border-accent bg-transparent text-accent hover:bg-accent hover:text-accent-on',
};

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-[12px]',
  lg: 'h-12 px-6 text-[13px]',
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
  children,
  ...rest
}: Props) {
  const cls = cn(base, variants[variant], sizes[size], className);

  if (href) {
    const isExternal = /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a href={href} className={cls} target="_blank" rel="noreferrer noopener">
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={cls} {...rest}>
      {children}
    </button>
  );
}
