import { redirect } from "next/navigation";

import BrandsManager, { type Brand } from "@/components/dashboard/BrandsManager";
import { getUserOrg } from "@/lib/org";
import { createClient } from "@/lib/supabase/server";

export default async function BrandsPage() {
  const org = await getUserOrg();
  if (!org) redirect("/dashboard/onboarding");

  const supabase = await createClient();
  const { data: brands } = await supabase
    .from("brands")
    .select("id, name, aliases, domains, is_competitor")
    .eq("org_id", org.orgId)
    .order("created_at", { ascending: true });

  return (
    <div>
      <p className="text-black/60 text-sm mb-2">Setup</p>
      <h1
        className="text-black text-3xl md:text-4xl font-medium leading-tight mb-4"
        style={{ letterSpacing: "-0.03em" }}
      >
        Brands &amp; Competitors
      </h1>
      <p className="text-black/60 text-base leading-relaxed max-w-xl mb-10">
        Every brand here is checked against every AI answer. Your own brand
        drives the visibility score; competitors power share of voice.
      </p>

      <BrandsManager
        orgId={org.orgId}
        initialBrands={(brands ?? []) as Brand[]}
        competitorLimit={org.competitorLimit}
      />
    </div>
  );
}
