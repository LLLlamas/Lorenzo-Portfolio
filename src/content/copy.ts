export const copy = {
  meta: {
    name: 'Lorenzo Llamas',
    role: 'Solo developer',
    email: 'hello@lorenzollamas.com',
    calendar: '',
    siteUrl: 'https://llllamas.github.io/Lorenzo-Portfolio',
  },

  hero: {
    eyebrow: 'Lorenzo Llamas — Solo developer',
    headline: 'Landing pages, websites, and small web tools — shipped fast.',
    subhead:
      'Solo senior developer. Landing pages and single-purpose tools first; bigger web apps and iOS when the project calls for it.',
    primaryCta: { label: 'See work', href: '/#work' },
    secondaryCta: { label: 'Start a project', href: '/contact' },
  },

  about: {
    eyebrow: 'About',
    paragraphs: [
      "I'm Lorenzo Llamas. I build landing pages, websites, and single-purpose web tools that solve real problems for real people — and bigger web apps or iOS when the project calls for one.",
      "Before going solo, I worked across financial systems, real estate technology, and frontend product teams, with UX research underneath all of it. That's why what I ship tends to feel obvious instead of clever.",
      'I move fast when the scope is clear. I bring the design — or build to yours.',
    ],
    pullQuote: 'Software is just an answer to a question someone actually had.',
  },

  work: {
    eyebrow: 'Work',
    headline: 'Selected projects.',
    subhead: 'Web, React, and iOS work grouped so the screenshots can breathe.',
  },

  projectModal: {
    overview: 'Overview',
    highlights: 'Highlights',
    stack: 'Stack',
    role: 'Role',
    year: 'Year',
    more: 'More views',
    visitLive: 'Visit live',
  },

  workGapFiller: {
    eyebrow: 'Available',
    headline: 'Could be yours.',
    body: 'Landing page, web tool, or focused web app — Spark or Studio.',
    cta: { label: 'Start a project', href: '/contact' },
  },

  capabilities: {
    eyebrow: 'Capabilities',
    headline: 'What I build.',
    subhead: 'Three modes. The first two are where most projects land.',
    items: [
      {
        title: 'Landing Pages & Websites',
        kicker: 'Primary',
        tagline: 'Marketing sites, product launches, portfolios, brand sites.',
        body: 'Fast, polished, performant. Built with motion that converts, not motion that distracts. Your design or mine.',
      },
      {
        title: 'Single-Purpose Web Tools',
        kicker: 'Primary',
        tagline: 'Calculators, dashboards, internal tools, focused web apps.',
        body: 'One thing, done well — not a sprawling MVP. Built on Next.js + a managed backend (Supabase / Neon / Convex) so you own it and it scales.',
      },
      {
        title: 'iOS Apps',
        kicker: 'Secondary',
        tagline: 'Native iOS when the project calls for it.',
        body: 'SwiftUI, App Store submission, post-launch support. Best for projects where mobile-native really matters (camera, location, notifications, on-device performance).',
      },
    ],
  },

  packages: {
    eyebrow: 'Packages',
    headline: 'Two tiers. Honest scope.',
    subhead: 'Public starting prices. Full quote on a call — filters serious leads, leaves scoping room.',
  },

  faq: {
    eyebrow: 'FAQ',
    headline: 'Honest answers.',
  },

  contactCta: {
    eyebrow: 'Start a project',
    headline: 'Got something in mind?',
    subhead:
      "The first call is free. Bring an idea, a wireframe, or a finished spec — we'll figure out scope together.",
    cta: { label: 'Start a project', href: '/contact' },
  },

  contact: {
    headline: 'Let’s build something.',
    subhead: 'Email me, book 20 minutes, or send a short note. I reply within one working day.',
    formNote: 'A few sentences is plenty. I reply within one working day.',
  },
} as const;
