"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check, X as XIcon } from "lucide-react";

import { aiPlatforms } from "@/components/AiEngineIcons";
import { GlassPanel, HeroBadge } from "@/components/ui/glass-hero";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { useInView } from "@/lib/use-in-view";

/**
 * Illustrative only — a drawing of what the dashboard reports, not a real
 * result for a real brand. Kept generic on purpose so it cannot be mistaken
 * for a measured claim.
 */
const sampleReadout = [
  { engine: "ChatGPT", named: true },
  { engine: "Perplexity", named: false },
  { engine: "Gemini", named: true },
];

export default function HeroSection() {
  const [marqueeRef, marqueeInView] = useInView<HTMLDivElement>();

  return (
    <section className="relative px-6 pt-10 pb-16 md:pb-24">
      <div className="relative z-10 max-w-[88rem] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col lg:pt-8"
          >
            <div className="mb-6">
              <HeroBadge>Answer Engine Optimization for Canada</HeroBadge>
            </div>

            <h1
              className="text-black text-5xl md:text-7xl font-bold leading-[1.02] mb-6"
              style={{ letterSpacing: "-0.03em" }}
            >
              <VerticalCutReveal
                splitBy="words"
                staggerDuration={0.07}
                staggerFrom="first"
                reverse
                transition={{
                  type: "spring",
                  stiffness: 270,
                  damping: 30,
                  delay: 0.15,
                }}
              >
                Be <span className="text-[#FF6E00]">The Answer</span> AI Gives.
              </VerticalCutReveal>
            </h1>

            <p className="text-black/60 text-lg leading-relaxed max-w-xl mb-9">
              Your customers ask AI for recommendations now, not Google. Cinder
              measures how often{" "}
              <strong className="font-semibold text-xl text-black">
                ChatGPT, Perplexity and Gemini
              </strong>{" "}
              name your brand, then fixes what is missing so those engines have{" "}
              <span className="font-semibold text-xl text-[#FF6E00] underline decoration-2 underline-offset-4 decoration-[#FF6E00]">
                something of yours to quote
              </span>
              .
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#FF6E00]"
              >
                Get a Free Audit
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-black/15 bg-white/90 px-8 py-4 text-sm font-semibold text-black transition-colors duration-300 hover:border-black/30 hover:bg-white md:bg-white/60 md:backdrop-blur-sm"
              >
                See how it works
              </Link>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col gap-5 lg:mt-10"
          >
            {/* Example readout, standing in for the demo's invented stats */}
            <GlassPanel className="p-7 md:p-8">
              <p className="text-black/40 text-[11px] font-medium uppercase tracking-[0.15em] mb-5">
                Example readout
              </p>

              <p className="text-black/50 text-sm mb-2">
                Someone asks an assistant:
              </p>
              <p className="text-black text-lg font-medium leading-snug mb-6">
                &ldquo;Best accountant for a small business in Toronto?&rdquo;
              </p>

              <div className="flex flex-col gap-2.5">
                {sampleReadout.map(({ engine, named }) => (
                  <div
                    key={engine}
                    className="flex items-center justify-between rounded-xl border border-black/10 bg-white/70 px-4 py-3"
                  >
                    <span className="text-black/70 text-sm font-medium">
                      {engine}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                        named ? "text-[#FF6E00]" : "text-black/35"
                      }`}
                    >
                      {named ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          Named you
                        </>
                      ) : (
                        <>
                          <XIcon className="h-3.5 w-3.5" />
                          Named a competitor
                        </>
                      )}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-black/40 text-xs leading-relaxed mt-5">
                An illustration of what Cinder reports, not a measured result.
              </p>
            </GlassPanel>

            {/* Engines, replacing the demo's client-logo marquee */}
            <GlassPanel className="py-7">
              <h2 className="px-7 md:px-8 text-black/50 text-sm mb-5">
                Live today across{" "}
                <strong className="font-semibold text-black">
                  ChatGPT, Perplexity and Gemini
                </strong>
                . Claude and Copilot are next.
              </h2>

              <div
                ref={marqueeRef}
                className="relative flex overflow-hidden"
                style={{
                  maskImage:
                    "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
                }}
              >
                <style>{`
                  @keyframes hero-engines-marquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                  }
                `}</style>
                {/* Parked once the hero scrolls away. It sits behind a mask,
                    so every frame it runs forces the masked region to
                    re-rasterise — for the whole visit, not just the hero. */}
                <div
                  className="flex w-max animate-[hero-engines-marquee_26s_linear_infinite] gap-10 px-4"
                  style={{
                    animationPlayState: marqueeInView ? "running" : "paused",
                    willChange: marqueeInView ? "transform" : "auto",
                  }}
                >
                  {[...aiPlatforms, ...aiPlatforms].map((platform, i) => (
                    <span
                      key={i}
                      className="flex shrink-0 items-center gap-2.5 whitespace-nowrap text-black/60"
                    >
                      {platform.icon}
                      <span className="text-base font-medium">
                        {platform.name}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </GlassPanel>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
