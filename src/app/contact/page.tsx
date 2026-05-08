import type { Metadata } from 'next';
import { Calendar, Mail } from 'lucide-react';
import { copy } from '@/content/copy';
import { contactFaqs } from '@/content/faqs';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Email, calendar, or short note. Replies within one working day.',
};

export default function ContactPage() {
  return (
    <section className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-quiet">
          Contact
        </p>
        <h1 className="mt-3 font-display text-balance text-5xl font-semibold tracking-tight md:text-6xl">
          {copy.contact.headline}
        </h1>
        <p className="mt-5 max-w-xl text-pretty text-lg text-ink-soft md:text-xl">
          {copy.contact.subhead}
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-full bg-accent-soft text-accent">
                <Mail className="size-4" aria-hidden />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-quiet">
                Email
              </p>
            </div>
            <a
              href={`mailto:${copy.meta.email}`}
              className="mt-4 block font-display text-xl font-medium tracking-tight text-ink hover:underline md:text-2xl"
            >
              {copy.meta.email}
            </a>
            <p className="mt-2 text-sm text-ink-soft">Replies within one working day.</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-full bg-accent-soft text-accent">
                <Calendar className="size-4" aria-hidden />
              </div>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-quiet">
                Book a call
              </p>
            </div>
            {copy.meta.calendar ? (
              <a
                href={copy.meta.calendar}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-4 block font-display text-xl font-medium tracking-tight text-ink hover:underline md:text-2xl"
              >
                Book a 20-min intro
              </a>
            ) : (
              <p className="mt-4 font-display text-xl font-medium tracking-tight text-ink-quiet md:text-2xl">
                Cal.com link coming soon
              </p>
            )}
            <p className="mt-2 text-sm text-ink-soft">
              Free, no commitment. Bring an idea or a wireframe.
            </p>
          </Card>
        </div>

        <div className="mt-10">
          <ContactForm />
        </div>

        <div className="mt-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-quiet">
            Quick FAQ
          </p>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {contactFaqs.map((faq) => (
              <li key={faq.question} className="py-4">
                <p className="font-display text-base font-medium text-ink">
                  {faq.question}
                </p>
                <p className="mt-1 text-sm text-ink-soft">{faq.answer}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  return (
    <Card as="section" className="p-6 md:p-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-quiet">
        Or send a short note
      </p>
      <p className="mt-1 text-sm text-ink-soft">{copy.contact.formNote}</p>

      <form
        className="mt-6 grid gap-4"
        method="POST"
        action="https://formspree.io/f/xvzlwoee"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Name" name="name" type="text" required autoComplete="name" />
          <Field label="Email" name="email" type="email" required autoComplete="email" />
        </div>
        <Field
          label="Message"
          name="message"
          as="textarea"
          rows={5}
          required
          placeholder="A few sentences about what you're building."
        />
        <div className="mt-2">
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-[15px] font-medium text-bg transition-opacity hover:opacity-90"
          >
            Send note
          </button>
        </div>
      </form>
    </Card>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  as?: 'input' | 'textarea';
  rows?: number;
};

function Field({
  label,
  name,
  type = 'text',
  required,
  autoComplete,
  placeholder,
  as = 'input',
  rows,
}: FieldProps) {
  const baseClass =
    'w-full rounded-[10px] border border-line bg-bg px-4 py-3 text-sm text-ink placeholder:text-ink-quiet focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-elevated';

  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-quiet">
        {label}
      </span>
      {as === 'textarea' ? (
        <textarea
          name={name}
          required={required}
          placeholder={placeholder}
          rows={rows}
          className={baseClass}
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={baseClass}
        />
      )}
    </label>
  );
}
