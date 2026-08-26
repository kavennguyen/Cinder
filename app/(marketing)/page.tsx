import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TwoPathsSection from "@/components/TwoPathsSection";
import ValueCardsSection from "@/components/ValueCardsSection";
import BackedBySection from "@/components/BackedBySection";
import ProcessSection from "@/components/ProcessSection";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    absolute: "AI Visibility Tracking for Canadian Brands | Cinder",
  },
  description:
    "Be the answer AI gives. Cinder helps Canadian brands and agencies earn visibility inside ChatGPT, Perplexity and Gemini.",
};

export default function Home() {
  return (
    <div className="flex flex-col bg-white">
      <div className="relative">
        <Navbar />
        <HeroSection />
      </div>
      <BackedBySection />
      <TwoPathsSection />
      <ProcessSection />
      <ValueCardsSection />
      <Footer />
    </div>
  );
}
