'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { ScrambleText } from '@/components/motion/ScrambleText';
import { navigation } from '@/content/navigation';
import { copy } from '@/content/copy';
import { cn, withBasePath } from '@/lib/utils';

const navLinks = navigation.primary;

/**
 * Editorial navbar — mono wordmark at left, bracketed mono links at right,
 * hairline + blur once scrolled. Height stays h-24 (coupled to pt-24,
 * Lenis offset -96, and scroll-margin-top: 6rem).
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      setScrolled(window.scrollY > 24);
      raf = 0;
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        scrolled
          ? 'border-b border-line bg-bg/75 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="mx-auto flex h-24 max-w-6xl items-center justify-between gap-6 px-6">
        {/* Brand — logo mark + mono wordmark */}
        <Link
          href="/"
          aria-label={`${copy.meta.name} — Home`}
          className="group flex items-center gap-3"
          data-cursor-hover
        >
          <Image
            src={withBasePath('/brand/llama-logo.webp')}
            alt=""
            width={512}
            height={512}
            priority
            className="size-9 object-contain transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-[-8deg]"
            data-glow-target=""
          />
          <span className="hidden whitespace-nowrap font-mono text-[13px] uppercase tracking-[0.22em] text-ink sm:inline">
            {copy.meta.name}
            <span className="text-accent">®</span>
          </span>
        </Link>

        {/* Primary nav — numbered waypoint links, scramble on hover */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-bracket text-[11px]"
              data-cursor-hover
            >
              <ScrambleText
                text={`0${i + 1}/ ${link.label}`}
                rescrambleOnHover
                duration={450}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            href="/contact"
            className="link-bracket link-bracket--accent text-[11px]"
            data-cursor-hover
          >
            <ScrambleText text="Start a project" rescrambleOnHover duration={450} />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
