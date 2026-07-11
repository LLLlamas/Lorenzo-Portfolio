import { About } from '@/components/sections/About';
import { ProofStrip } from '@/components/sections/ProofStrip';
import { Work } from '@/components/sections/Work';
import { Capabilities } from '@/components/sections/Capabilities';
import { Packages } from '@/components/sections/Packages';
import { FAQ } from '@/components/sections/FAQ';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { HeroCradleSection } from '@/components/sections/HeroCradleSection';

export default function HomePage() {
  return (
    <>
      <HeroCradleSection />
      <About />
      <ProofStrip />
      <Work />
      <Capabilities />
      <Packages />
      <FAQ />
      <ContactCTA />
    </>
  );
}
