export type FAQ = { question: string; answer: string };

export const faqs: FAQ[] = [
  {
    question: "What's your turnaround?",
    answer: 'Spark in ~1–2 weeks. Studio in ~3–5 weeks. Rush delivery available at +35%.',
  },
  {
    question: 'Do you do design too?',
    answer: "Yes. UX/UI is built into Studio pricing. If you bring finalized Figma, that's −15%.",
  },
  {
    question: 'What stack do you use?',
    answer:
      'Next.js + TypeScript + Tailwind for web. SwiftUI for iOS. Supabase / Neon / Convex for backends. Vercel or Cloudflare for hosting.',
  },
  {
    question: 'Do you sign NDAs?',
    answer: 'Yes, mutual NDA before any scoping call.',
  },
  {
    question: 'What if I just have an idea, not a spec?',
    answer:
      "Most clients start there. The first call is free and we'll figure out scope together.",
  },
  {
    question: "What's not in scope?",
    answer:
      'Marketing, paid ads, content writing beyond UX copy, ongoing product management. I can recommend people for those.',
  },
];

export const contactFaqs: FAQ[] = [
  {
    question: "What's your turnaround?",
    answer: 'Spark in ~1–2 weeks. Studio in ~3–5 weeks. Rush available.',
  },
  {
    question: 'Do you sign NDAs?',
    answer: 'Yes — mutual NDA before any scoping call.',
  },
  {
    question: 'What if I just have an idea?',
    answer: "That's fine. First call is free and we'll scope it together.",
  },
];
