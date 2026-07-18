import type { Metadata } from "next";

import CaseStudiesContent from "@/components/pages/CaseStudiesContent";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "How Cinder has helped brands earn visibility inside AI-generated answers across ChatGPT, Perplexity, Gemini, and Copilot.",
};

export default function CaseStudiesPage() {
  return <CaseStudiesContent />;
}
