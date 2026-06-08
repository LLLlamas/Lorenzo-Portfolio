import Link from 'next/link';
import { copy } from '@/content/copy';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="section-glass relative border-t">
      {/* Hairline accent */}
      <span
        aria-hidden
        className="absolute left-0 right-0 top-0 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />

      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 text-sm text-ink-soft">
        <p>© {year} {copy.meta.name}. Built solo.</p>
        <div className="flex items-center gap-5">
          <Link href="/contact" className="transition-colors hover:text-ink">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
