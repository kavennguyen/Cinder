import { NextResponse } from "next/server";

import { getUserOrg } from "@/lib/org";
import { runPromptsForOrg } from "@/lib/runner";
import { createAdminClient } from "@/lib/supabase/admin";

export const maxDuration = 300; // allow long runs (Vercel: needs Pro for >60s)

export async function POST() {
  // Manual trigger: must be a signed-in member of an org.
  const org = await getUserOrg();
  if (!org) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
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

  const summary = await runPromptsForOrg(admin, org.orgId);
  if (summary.ran === 0 && summary.errors === 0) {
    return NextResponse.json({
      ...summary,
      message:
        "No active prompts with Gemini selected. Add prompts (with the Gemini platform) first.",
    });
  }
  return NextResponse.json(summary);
}
