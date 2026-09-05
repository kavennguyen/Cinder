import type { Metadata } from "next";

import ServicesContent from "@/components/pages/ServicesContent";

export const metadata: Metadata = {
  title: "AI Visibility Dashboard & Done For You AEO",
  description:
    "A done-for-you AI visibility service for Canadian small businesses. Our team measures where you stand, ships the changes, and reports what moved.",
};

export default function ServicesPage() {
  return <ServicesContent />;
}
