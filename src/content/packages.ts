export type PricingPackage = {
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  popular?: boolean;
};

export const packages: PricingPackage[] = [
  {
    name: 'Spark',
    price: 'Starting at $2,000',
    cadence: '~1–2 weeks',
    description: 'A landing page, single-purpose site, or small web tool.',
    popular: true,
    features: [
      'Landing page, marketing site, or focused web tool (~3–5 sections/screens)',
      'Your design or mine',
      '1 round of revisions',
      'Deployed (Vercel / Cloudflare / GitHub Pages)',
      'Analytics + basic SEO baked in',
      '14-day post-launch bug-fix window',
    ],
  },
  {
    name: 'Studio',
    price: 'Starting at $6,500',
    cadence: '~3–5 weeks',
    description: 'A bigger site, web tool, or focused web app.',
    features: [
      'Multi-page site, web tool, or focused web app with backend, auth, and meaningful state',
      'Or a multi-page marketing site with CMS',
      'Or an iOS app (Spark-equivalent scope)',
      "UX conversation + wireframes if you don't bring designs",
      '2 rounds of revisions',
      'Deployment, analytics, App Store submission if applicable',
      '30-day post-launch support window',
    ],
  },
];

export type Modifier = { label: string; adjustment: string };

export const modifiers: Modifier[] = [
  { label: 'Rush delivery', adjustment: '+35%' },
  { label: 'Design provided (finalized Figma)', adjustment: '−15%' },
  { label: 'iOS instead of web (within Studio)', adjustment: '+$1,500' },
  { label: 'Maintenance retainer', adjustment: '$750/mo · capped 8 hrs' },
];
