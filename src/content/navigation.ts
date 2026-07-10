export const navigation = {
  primary: [
    { href: '/#work', label: 'Work' },
    { href: '/#capabilities', label: 'Capabilities' },
    { href: '/#packages', label: 'Packages' },
    { href: '/#faq', label: 'FAQ' },
  ],
  /** Full-screen overlay menu — primary plus the contact destination. */
  overlay: [
    { href: '/#work', label: 'Work' },
    { href: '/#capabilities', label: 'Capabilities' },
    { href: '/#packages', label: 'Packages' },
    { href: '/#faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ],
} as const;
