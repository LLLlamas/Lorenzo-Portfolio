'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { cn, withBasePath } from '@/lib/utils';

const navLinks = [
  { href: '/#work', label: 'Work' },
  { href: '/#capabilities', label: 'Capabilities' },
  { href: '/#packages', label: 'Packages' },
  { href: '/#faq', label: 'FAQ' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
      <div className="mx-auto flex h-24 max-w-6xl items-center justify-between gap-6 px-6">
        <BrandHexPrism />

        <nav className="hidden items-center gap-3 md:flex">
          {navLinks.map((link) => (
            <NavCube key={link.href} href={link.href} label={link.label} />
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
function NavCube({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="nav-cube" data-cursor-hover>
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
