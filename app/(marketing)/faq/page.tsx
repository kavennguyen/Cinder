import type { Metadata } from "next";

import FaqContent from "@/components/pages/FaqContent";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to the questions we hear most about AI visibility, pricing, and how Cinder works.",
};

export default function FaqPage() {
  return <FaqContent />;
}
