import Link from 'next/link';
import { copy } from '@/content/copy';
import { navigation } from '@/content/navigation';

/**
 * Editorial footer — mono link columns above a giant full-width wordmark,
 * compact legal row underneath. Still no email address here (email lives in
 * ContactCTA and /contact only).
 */
export function Footer() {
  const year = new Date().getFullYear();
  const [firstName, lastName] = copy.meta.name.split(' ');

  return (
    <footer className="section-glass relative border-t">
      {/* Hairline accent */}
      <span
        aria-hidden
        className="absolute left-0 right-0 top-0 mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />

      <div className="mx-auto max-w-6xl px-6 pt-14">
        {/* Mono link columns */}
        <div className="grid gap-10 pb-14 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-quiet">
              Menu/
            </p>
            <ul className="mt-4 space-y-2.5">
              {navigation.primary.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-mono text-xs uppercase tracking-[0.16em] text-ink-soft transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-quiet">
              Contact/
            </p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/contact"
                  className="link-bracket text-xs"
                >
                  Start a project
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-quiet">
              Base/
            </p>
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.16em] text-ink-soft">
              {copy.hero.annotation}
            </p>
          </div>
        </div>

        {/* Giant wordmark — cropped at the baseline like a print sign-off */}
        <p
          aria-hidden
          className="pointer-events-none select-none overflow-hidden whitespace-nowrap text-center font-display text-[clamp(2.4rem,8.4vw,7.8rem)] font-extrabold uppercase leading-[0.78] tracking-[-0.03em] text-ink/90"
        >
          {firstName}
          <span className="text-accent">.</span>
          {lastName}
        </p>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-quiet">
          <p>© {year} {copy.meta.name} — Built solo</p>
          <Link href="/contact" className="transition-colors hover:text-accent">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
