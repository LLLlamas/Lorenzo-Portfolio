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

      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-12 pt-20 md:pt-28">
        <a
          href={`mailto:${copy.meta.email}`}
          className="group block font-display text-3xl font-semibold leading-tight tracking-tight text-ink transition-colors hover:text-accent md:text-5xl lg:text-6xl"
        >
          <span className="underline decoration-line decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-accent">
            {copy.meta.email}
          </span>
        </a>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-sm text-ink-soft md:flex-row md:items-center">
          <p>
            © {year} {copy.meta.name}. Built solo.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/contact" className="transition-colors hover:text-ink">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
