import Link from 'next/link';
import { copy } from '@/content/copy';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-10 text-sm text-ink-soft md:flex-row md:items-center">
        <p>
          © {year} {copy.meta.name}. Built solo.
        </p>
        <div className="flex items-center gap-5">
          <Link href="/contact" className="transition-colors hover:text-ink">
            Contact
          </Link>
          <a
            href={`mailto:${copy.meta.email}`}
            className="transition-colors hover:text-ink"
          >
            {copy.meta.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
