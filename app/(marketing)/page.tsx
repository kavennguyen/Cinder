import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import { HeroBloom } from "@/components/ui/glass-hero";
import HeroSection from "@/components/HeroSection";
import BentoSection from "@/components/BentoSection";
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
        {/* One bento carries what used to be three stacked sections: what
            Cinder is and the four steps, both tracks, and the value props. */}
        <BentoSection />
        <Footer />
      </div>
    </div>
  );
}
