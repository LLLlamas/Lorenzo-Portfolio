import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-ink-quiet">
          404
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
          Nothing here.
        </h1>
        <p className="mt-3 text-pretty text-base text-ink-soft">
          Whatever you were looking for has moved or never existed. Let&apos;s get you home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="btn-sweep group inline-flex h-11 items-center justify-center rounded-full border border-ink bg-ink px-5 text-sm font-medium text-bg transition-colors hover:text-accent-on hover:border-accent"
            style={{ ['--sweep-bg' as never]: 'var(--accent)' }}
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="btn-sweep group inline-flex h-11 items-center justify-center rounded-full border border-line bg-transparent px-5 text-sm font-medium text-ink transition-colors hover:text-accent-on hover:border-accent"
            style={{ ['--sweep-bg' as never]: 'var(--accent)' }}
          >
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
