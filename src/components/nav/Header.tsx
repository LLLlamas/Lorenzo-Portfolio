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

  // Track which section is currently in view to drive the pixel indicator.
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport that's intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
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
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <Link
          href="/"
          className="font-display text-sm font-semibold tracking-tight text-ink transition-colors hover:text-accent"
          aria-label="Lorenzo Llamas — Home"
        >
          Lorenzo&nbsp;Llamas
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = active === link.id;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'group relative rounded-full px-3 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'text-ink'
                    : 'text-ink-soft hover:text-ink',
                )}
              >
                {link.label}
                {/* Pixel indicator — small accent square under active link */}
                <span
                  aria-hidden
                  className={cn(
                    'absolute left-1/2 top-full size-1 -translate-x-1/2 -translate-y-1 bg-accent transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50',
                  )}
                  style={{ boxShadow: isActive ? '0 0 8px var(--accent)' : 'none' }}
                />
              </Link>
            );
          })}
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
