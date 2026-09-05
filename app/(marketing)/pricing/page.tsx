import type { Metadata } from "next";

import PricingContent from "@/components/pages/PricingContent";

export const metadata: Metadata = {
  title: "Pricing for AI Visibility Tracking & Managed AEO",
  description:
    "Two levels of a fully managed AI visibility service for Canadian businesses. Priced in CAD, month to month.",
};

export default function PricingPage() {
  return <PricingContent />;
}
