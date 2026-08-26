import type { Metadata } from "next";

import CaseStudiesContent from "@/components/pages/CaseStudiesContent";

export const metadata: Metadata = {
  title: "AI Visibility Case Studies",
  description:
    "How Cinder has helped brands earn visibility inside AI generated answers across ChatGPT, Perplexity and Gemini.",
};

export default function CaseStudiesPage() {
  return <CaseStudiesContent />;
}
