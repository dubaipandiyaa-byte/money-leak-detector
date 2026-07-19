"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Permanently deletes the signed-in user's account and, via the reports
 * table's ON DELETE CASCADE, every report they saved. Runs through the
 * `delete_user()` SECURITY DEFINER function in supabase-schema.sql — the
 * client role itself has no privilege to touch auth.users.
 */
export async function deleteAccount(): Promise<{ error: string } | void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?next=%2Fdata-retention");
  }

  const { error } = await supabase.rpc("delete_user");
  if (error) {
    return {
      error:
        "Account deletion isn't available right now. Please try again later or contact us and we'll do it by hand.",
    };
  }

  await supabase.auth.signOut();
  redirect("/?account-deleted=1");
}
