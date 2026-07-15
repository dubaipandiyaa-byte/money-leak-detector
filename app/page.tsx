import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { TrustedBy } from "@/components/landing/TrustedBy";
import { CurrencyTicker } from "@/components/landing/CurrencyTicker";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { IntelligenceEngine } from "@/components/landing/IntelligenceEngine";
import { LeakShowcase } from "@/components/landing/LeakShowcase";
import { InsightsShowcase } from "@/components/landing/InsightsShowcase";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TrustedBy />
        <CurrencyTicker />
        <HowItWorks />
        <IntelligenceEngine />
        <LeakShowcase />
        <InsightsShowcase />
        <Testimonials />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
