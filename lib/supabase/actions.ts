"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Shared sign-out action, used from both the landing nav and dashboard nav. */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

/**
 * Permanently deletes one saved report. No explicit ownership check is
 * needed here — the RLS "delete own reports" policy means this can only
 * ever affect a row the signed-in user actually owns; deleting someone
 * else's id is a silent no-op, not a bypassable check.
 */
export async function deleteReport(reportId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("reports").delete().eq("id", reportId);
  revalidatePath("/history");
  revalidatePath("/dashboard");
}
