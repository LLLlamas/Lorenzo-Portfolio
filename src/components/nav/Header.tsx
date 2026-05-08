'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';

const navLinks = [
  { id: 'work', href: '/#work', label: 'Work' },
  { id: 'capabilities', href: '/#capabilities', label: 'Capabilities' },
  { id: 'packages', href: '/#packages', label: 'Packages' },
  { id: 'faq', href: '/#faq', label: 'FAQ' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section: pick whichever nav-linked section currently straddles
  // the "reading line" (≈33% from the top of the viewport). More accurate
  // than IntersectionObserver thresholds for variable-height sections.
  useEffect(() => {
    let raf = 0;
    let pending = false;

    const compute = () => {
      pending = false;
      const sections = navLinks
        .map((l) => document.getElementById(l.id))
        .filter((el): el is HTMLElement => !!el);
      if (sections.length === 0) return;

      const line = window.innerHeight * 0.33;
      let current: string | null = null;
      for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= line && rect.bottom > line) {
          current = sec.id;
          break;
        }
      }
      setActive(current);
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        scrolled
          ? 'border-b border-line bg-bg/80 backdrop-blur-md supports-[backdrop-filter]:bg-bg/65'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-6">
        <BrandHex />

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <NavBox
              key={link.id}
              href={link.href}
              label={link.label}
              active={active === link.id}
            />
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="btn-sweep group hidden items-center rounded-full border border-ink bg-ink px-4 py-2 text-xs font-medium tracking-tight text-bg transition-colors hover:border-accent hover:text-accent-on md:inline-flex"
            style={{ ['--sweep-bg' as never]: 'var(--accent)' }}
          >
            Start a project
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

/**
 * Brand mark — bigger name in a hexagonal frame that rotates on hover.
 * SVG hex outline rotates while the text stays static for legibility.
 */
function BrandHex() {
  return (
    <Link
      href="/"
      aria-label="Lorenzo Llamas — Home"
      className="group relative inline-flex h-12 items-center px-5 font-display text-base font-semibold tracking-tight text-ink transition-colors hover:text-accent md:text-[17px]"
    >
      <svg
        aria-hidden
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full text-line transition-[transform,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[60deg] group-hover:text-accent"
      >
        <polygon
          points="25,2 175,2 198,50 175,98 25,98 2,50"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="relative">Lorenzo&nbsp;Llamas</span>
    </Link>
  );
}

/**
 * Nav link rendered as a rotating square box. The SVG outline rotates on
 * hover; the label stays put. Active state lights the border in accent.
 */
function NavBox({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative inline-flex h-10 items-center justify-center px-4 text-sm transition-colors',
        active ? 'text-ink' : 'text-ink-soft hover:text-ink',
      )}
      data-cursor-hover
    >
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className={cn(
          'absolute inset-0 h-full w-full transition-[transform,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[45deg]',
          active ? 'text-accent' : 'text-line group-hover:text-accent',
        )}
      >
        <rect
          x="2"
          y="2"
          width="96"
          height="96"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="relative">{label}</span>
      {/* Active pixel — small accent dot under the active link */}
      <span
        aria-hidden
        className={cn(
          'absolute left-1/2 top-full size-1 -translate-x-1/2 -translate-y-1 bg-accent transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          active ? 'scale-100 opacity-100' : 'scale-50 opacity-0',
        )}
        style={{ boxShadow: active ? '0 0 8px var(--accent)' : 'none' }}
      />
    </Link>
  );
}
