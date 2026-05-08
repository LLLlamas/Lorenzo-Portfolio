import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { href: '/#work', label: 'Work' },
  { href: '/#capabilities', label: 'Capabilities' },
  { href: '/#packages', label: 'Packages' },
  { href: '/#faq', label: 'FAQ' },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-bg/70 backdrop-blur-md supports-[backdrop-filter]:bg-bg/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <Link
          href="/"
          className="font-display text-sm font-semibold tracking-tight text-ink"
          aria-label="Lorenzo Llamas — Home"
        >
          Lorenzo&nbsp;Llamas
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90 md:inline-flex"
          >
            Start a project
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
