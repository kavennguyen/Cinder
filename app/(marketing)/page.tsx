import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import { HeroBloom } from "@/components/ui/glass-hero";
import HeroSection from "@/components/HeroSection";
import TwoPathsSection from "@/components/TwoPathsSection";
import ValueCardsSection from "@/components/ValueCardsSection";
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
    <div className="relative flex flex-col bg-white">
      {/* Backdrop spans the navbar and the hero so the two read as one
          surface. It sits at z-0 above the wrapper background; a negative
          z-index would paint behind it and vanish. Sections need relative
          z-10 because static elements otherwise paint below a z-0 sibling. */}
      <HeroBloom />
      <Navbar />
      <div className="relative z-10 flex flex-col">
        <HeroSection />
        {/* Narrative order: hook, then what Cinder is and how it works, then
            which of the two tracks you are, then why it compounds. */}
        <ProcessSection />
        <TwoPathsSection />
        <ValueCardsSection />
        <Footer />
      </div>
    </div>
  );
}
