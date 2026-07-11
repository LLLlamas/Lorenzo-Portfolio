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
  /** Right-edge journey rail — landing-page section ids + display labels. */
  waypoints: [
    { id: 'hero', label: 'Intro' },
    { id: 'about', label: 'About' },
    { id: 'work', label: 'Work' },
    { id: 'capabilities', label: 'Capabilities' },
    { id: 'packages', label: 'Packages' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact-cta', label: 'Contact' },
  ],
} as const;
