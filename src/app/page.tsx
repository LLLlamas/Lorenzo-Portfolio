import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Work } from '@/components/sections/Work';
import { Capabilities } from '@/components/sections/Capabilities';
import { Packages } from '@/components/sections/Packages';
import { FAQ } from '@/components/sections/FAQ';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { MarqueeTechStrip } from '@/components/sections/MarqueeTechStrip';

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeTechStrip />
      <About />
      <Work />
      <Capabilities />
      <Packages />
      <FAQ />
      <ContactCTA />
    </>
  );
}
