import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Landing target for Supabase email links (signup confirmation and password
 * reset both redirect here with a `code`). Exchanges it for a real session
 * cookie, then continues to `next` (defaults to the dashboard).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("That link is invalid or has expired.")}`
  );
}
