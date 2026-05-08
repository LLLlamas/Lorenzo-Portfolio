import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="grid min-h-[70vh] place-items-center px-6">
      <div className="max-w-md text-center">
        <p className="loading-blink font-mono text-[11px] uppercase tracking-[0.32em] text-accent">
          ERR · 404
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-[0.02em] md:text-5xl">
          Nothing here.
        </h1>
        <p className="mt-3 text-pretty text-base text-ink-soft">
          Whatever you were looking for has moved or never existed. Let&apos;s get you home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="btn-glow inline-flex h-11 items-center justify-center rounded-full border border-accent bg-accent px-5 font-mono text-[12px] uppercase tracking-[0.16em] text-accent-on hover:bg-transparent hover:text-accent"
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="btn-glow inline-flex h-11 items-center justify-center rounded-full border border-line bg-transparent px-5 font-mono text-[12px] uppercase tracking-[0.16em] text-ink hover:border-line-accent hover:text-accent"
          >
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
