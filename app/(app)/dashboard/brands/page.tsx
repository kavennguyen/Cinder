import { redirect } from "next/navigation";

import BrandsManager, { type Brand } from "@/components/dashboard/BrandsManager";
import PageHeading from "@/components/dashboard/PageHeading";
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
      <PageHeading eyebrow="Setup" title="Brands & Competitors">
        Every brand here is checked against every AI answer. Your own brand
        drives the visibility score; competitors power share of voice.
      </PageHeading>

      <BrandsManager
        orgId={org.orgId}
        initialBrands={(brands ?? []) as Brand[]}
        competitorLimit={org.competitorLimit}
      />
    </div>
  );
}
