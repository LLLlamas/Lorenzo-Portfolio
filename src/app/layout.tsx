import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Header } from '@/components/nav/Header';
import { Footer } from '@/components/nav/Footer';
import { ScrollProgress } from '@/components/motion/ScrollProgress';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { CursorGlow } from '@/components/motion/CursorGlow';
import { EntrySequence } from '@/components/motion/EntrySequence';
import { GlobalRippleTap } from '@/components/motion/GlobalRippleTap';
import { ScrollScaleMount } from '@/components/motion/ScrollScaleMount';
import { VoidBackground } from '@/components/motion/VoidBackground';
import { JourneyRail } from '@/components/motion/JourneyRail';
import { copy } from '@/content/copy';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(copy.meta.siteUrl),
  title: {
    default: `${copy.meta.name} — ${copy.meta.role}`,
    template: `%s · ${copy.meta.name}`,
  },
  description: copy.hero.subhead,
  openGraph: {
    title: copy.meta.name,
    description: copy.hero.subhead,
    type: 'website',
    siteName: copy.meta.name,
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: copy.meta.name,
    description: copy.hero.subhead,
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAFAF7' },
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0D' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh text-ink antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <VoidBackground />
          <JourneyRail />
          <SmoothScroll />
          <ScrollProgress />
          <CursorGlow />
          <EntrySequence />
          <GlobalRippleTap />
          <ScrollScaleMount />
          <Header />
          <main className="pt-24">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
