import type { Metadata, Viewport } from 'next';
import { DM_Sans, Share_Tech_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { Header } from '@/components/nav/Header';
import { Footer } from '@/components/nav/Footer';
import { ScrollProgress } from '@/components/motion/ScrollProgress';
import { SmoothScroll } from '@/components/motion/SmoothScroll';
import { CustomCursor } from '@/components/motion/CustomCursor';
import { EntrySequence } from '@/components/motion/EntrySequence';
import { copy } from '@/content/copy';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const shareTechMono = Share_Tech_Mono({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-share-tech-mono',
  display: 'swap',
});

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
    { media: '(prefers-color-scheme: light)', color: '#F7F4EE' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${shareTechMono.variable}`}
    >
      <body className="min-h-dvh bg-bg text-ink antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SmoothScroll />
          <ScrollProgress />
          <CustomCursor />
          <EntrySequence />
          <Header />
          <main className="pt-16">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
