import type { Metadata } from "next";
import { Aurora } from "@/components/ui/Aurora";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { Greeting } from "@/components/dashboard/Greeting";
import { GuardianCard } from "@/components/dashboard/GuardianCard";
import { Widgets } from "@/components/dashboard/Widgets";
import { Timeline } from "@/components/dashboard/Timeline";
import { InsightFeed } from "@/components/dashboard/InsightFeed";
import { LeakGrid } from "@/components/dashboard/LeakGrid";
import { GuardianChat } from "@/components/dashboard/GuardianChat";

export const metadata: Metadata = {
  title: "Command Center",
};

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen">
      <Aurora variant="dashboard" />
      <DashboardNav />

      <main className="relative mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-6">
        <Greeting />

        <div className="mt-8">
          <GuardianCard />
        </div>

        <div className="mt-6">
          <Widgets />
        </div>

        <div className="mt-6">
          <LeakGrid />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
          <Timeline />
          <InsightFeed />
        </div>
      </main>

      <GuardianChat />
    </div>
  );
}
