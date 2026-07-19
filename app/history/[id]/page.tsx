import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Aurora } from "@/components/ui/Aurora";
import { SimpleHeader } from "@/components/ui/SimpleHeader";
import { HistoryReportClient } from "@/components/history/HistoryReportClient";
import { createClient } from "@/lib/supabase/server";
import { getUserReport } from "@/lib/supabase/reports";

export const metadata: Metadata = {
  title: "Saved Report",
};

export default async function HistoryReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/history/${id}`);

  // Row Level Security means this simply returns nothing for a report that
  // isn't the signed-in user's — there is no separate ownership check to
  // get wrong here.
  const loaded = await getUserReport(supabase, id);
  if (!loaded) notFound();

  return (
    <div className="relative min-h-screen">
      <Aurora variant="dashboard" />
      <SimpleHeader ctaLabel="All reports →" ctaHref="/history" />

      <main className="relative mx-auto max-w-6xl px-5 pb-24 pt-12 sm:px-6">
        <HistoryReportClient report={loaded.report} fileName={loaded.fileName} />
      </main>
    </div>
  );
}
