'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { navigation } from '@/content/navigation';
import { cn, withBasePath } from '@/lib/utils';

const navLinks = navigation.primary;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const compactRef = useRef(false);

  useEffect(() => {
    const sectionIds = navLinks
      .map((link) => link.href.split('#')[1])
      .filter((id): id is string => Boolean(id));

    let lastY = window.scrollY;
    let raf = 0;

    const updateActiveSection = (nextCompact: boolean) => {
      const activationLine = nextCompact ? 84 : 118;
      let nextActive: string | null = null;

      for (const id of sectionIds) {
        const section = document.getElementById(id);
        if (!section) continue;
        if (section.getBoundingClientRect().top <= activationLine) {
          nextActive = id;
        }
      }

      setActiveSection(nextActive);
    };

    const updateHeader = () => {
      const currentY = Math.max(window.scrollY, 0);
      const delta = currentY - lastY;
      let nextCompact = compactRef.current;

      setScrolled(currentY > 24);

      if (currentY < 72) {
        nextCompact = false;
      } else if (delta > 4) {
        nextCompact = true;
      } else if (delta < -4) {
        nextCompact = false;
      }

      if (nextCompact !== compactRef.current) {
        compactRef.current = nextCompact;
        setCompact(nextCompact);
      }

      updateActiveSection(nextCompact);
      lastY = currentY;
      raf = 0;
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(updateHeader);
    };

    onScroll();
    window.addEventListener('resize', onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header
      data-nav-state={compact ? 'compact' : 'expanded'}
      className={cn(
        'site-header fixed inset-x-0 top-0 z-40 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        compact && 'site-header--compact',
        scrolled
          ? 'border-b border-line/10 bg-bg/95 shadow-[0_16px_50px_-38px_var(--accent)] backdrop-blur-xl'
          : 'border-b border-transparent bg-bg/60 backdrop-blur-md',
      )}
    >
      <div className="relative mx-auto flex h-24 max-w-6xl items-center justify-between gap-6 px-6">
        <BrandHexPrism />

        <nav className="site-nav-track hidden items-center md:absolute md:flex">
          {navLinks.map((link) => (
            <NavCube
              key={link.href}
              href={link.href}
              label={link.label}
              active={activeSection === link.href.split('#')[1]}
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
 * 6-face CSS 3D cube. Front + back show the label; top/bottom/left/right
 * are thin "depth" strips. A persistent rotateX(-12) rotateY(-15) keeps
 * the depth visible at rest. Hover rolls rotateY by +180 so the cube
 * flips card-style to its back face (accent-bordered + accent text).
 */
function NavCube({
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
      className={cn('nav-cube', active && 'nav-cube--active')}
      aria-current={active ? 'page' : undefined}
      data-cursor-hover
    >
      <div className="nav-cube__inner">
        <div className="nav-cube__face nav-cube__face--front">
          <span>{label}</span>
        </div>
        <div className="nav-cube__face nav-cube__face--back">
          <span>{label}</span>
        </div>
        <div className="nav-cube__face nav-cube__face--top" />
        <div className="nav-cube__face nav-cube__face--bottom" />
        <div className="nav-cube__face nav-cube__face--left" />
        <div className="nav-cube__face nav-cube__face--right" />
      </div>
    </Link>
  );
}

/**
 * Square 2-face flip card holding the chef-llama brand logo. Front + back
 * both render the same image; on hover the parent rotates rotateY(180deg)
 * for a card-flip flourish (and the back face's combined rotation lands
 * back at +Z so the logo isn't mirrored). `backface-visibility: hidden`
 * on each face means only the camera-facing side renders.
 */
function BrandHexPrism() {
  return (
    <Link
      href="/"
      aria-label="Lorenzo Llamas — Home"
      className="brand-hex"
    >
      <div className="brand-hex__inner">
        <div className="brand-hex__face brand-hex__face--front">
          <Image
            src={withBasePath('/brand/llama-logo.webp')}
            alt=""
            width={512}
            height={512}
            priority
            className="size-full object-contain"
            data-glow-target=""
          />
        </div>
        <div className="brand-hex__face brand-hex__face--back">
          <Image
            src={withBasePath('/brand/llama-logo.webp')}
            alt=""
            width={512}
            height={512}
            className="size-full object-contain"
          />
        </div>
      </div>
    </Link>
  );
}
