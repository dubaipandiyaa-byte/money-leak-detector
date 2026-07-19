import { Nav } from "@/components/landing/Nav";
import { AppNav } from "@/components/ui/AppNav";
import { Hero } from "@/components/landing/Hero";
import { FactsBar } from "@/components/landing/FactsBar";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LeakShowcase } from "@/components/landing/LeakShowcase";
import { InsightsShowcase } from "@/components/landing/InsightsShowcase";
import { PrivacySecurity } from "@/components/landing/PrivacySecurity";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="bg-noir">
      {user ? <AppNav /> : <Nav isSignedIn={false} />}
      <main>
        <Hero />
        <FactsBar />
        <HowItWorks />
        <LeakShowcase />
        <InsightsShowcase />
        <PrivacySecurity />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
