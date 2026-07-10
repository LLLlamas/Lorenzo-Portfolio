'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { OverlayMenu } from './OverlayMenu';
import { ScrambleText } from '@/components/motion/ScrambleText';
import { navigation } from '@/content/navigation';
import { copy } from '@/content/copy';
import { cn, withBasePath } from '@/lib/utils';

const navLinks = navigation.primary;

/**
 * Editorial navbar — mono wordmark at left; numbered bracket links inline at
 * lg+ only (below that they collide with the wordmark); a [ Menu ] trigger on
 * every size opens the full-screen OverlayMenu. Height stays h-24 (coupled to
 * pt-24, Lenis offset -96, and scroll-margin-top: 6rem).
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <>
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

          {/* Inline waypoint links — lg+ only */}
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className="link-bracket whitespace-nowrap text-[11px]"
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
              href={copy.hero.secondaryCta.href}
              className="link-bracket link-bracket--accent hidden whitespace-nowrap text-[11px] md:inline-block"
              data-cursor-hover
            >
              <ScrambleText text={copy.hero.secondaryCta.label} rescrambleOnHover duration={450} />
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              className="link-bracket cursor-pointer text-[11px]"
              data-cursor-hover
            >
              <ScrambleText text={copy.nav.menu} rescrambleOnHover duration={400} />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <OverlayMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
