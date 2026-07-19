import { NextResponse } from "next/server";

import { runPromptsForOrg } from "@/lib/runner";
import { createAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 300;

/**
 * Scheduled runner — hit daily by Vercel Cron (see vercel.json).
 * Vercel automatically sends `Authorization: Bearer $CRON_SECRET` when the
 * CRON_SECRET env var is set on the project.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Admin client error" },
      { status: 500 },
    );
  }

  // Every org with a live (trialing/active) subscription gets a daily run.
  const { data: subs } = await admin
    .from("subscriptions")
    .select("org_id")
    .in("status", ["trialing", "active"]);

  const results: Record<string, { ran: number; errors: number; mentionsFound: number }> = {};
  for (const sub of subs ?? []) {
    results[sub.org_id] = await runPromptsForOrg(admin, sub.org_id);
  }

  return NextResponse.json({ orgs: Object.keys(results).length, results });
}
