import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center px-6">
      <div className="max-w-md text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-quiet">
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
            className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-transparent px-5 text-sm font-medium text-ink transition-colors hover:bg-ink/[0.04]"
          >
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
