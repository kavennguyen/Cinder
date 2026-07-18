import type { Metadata } from "next";

import ServicesContent from "@/components/pages/ServicesContent";

export const metadata: Metadata = {
  title: "Services",
  description:
    "An AI visibility dashboard for agencies and a done-for-you optimization service for small businesses. The tools to see it, the team to do it.",
};

export default function ServicesPage() {
  return <ServicesContent />;
}
