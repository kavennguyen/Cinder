import { redirect } from "next/navigation";

import OnboardingForm from "@/components/dashboard/OnboardingForm";
import { getUserOrg } from "@/lib/org";

export default async function OnboardingPage() {
  const org = await getUserOrg();
  if (org) redirect("/dashboard");
  return <OnboardingForm />;
}
