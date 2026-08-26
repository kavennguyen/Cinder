import type { Metadata } from "next";

import PricingContent from "@/components/pages/PricingContent";

export const metadata: Metadata = {
  title: "Pricing for AI Visibility Tracking & Managed AEO",
  description:
    "Transparent monthly plans: a self-serve dashboard for teams and agencies, and a fully managed AI visibility service for small business.",
};

export default function PricingPage() {
  return <PricingContent />;
}
