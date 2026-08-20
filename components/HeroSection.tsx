"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { ImageAccordion } from "./ui/interactive-image-accordion";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";

export default function HeroSection() {
  return (
    <section className="bg-white px-6 pt-20 pb-16 md:pb-24">
      <div className="max-w-[88rem] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-1/2 text-center md:text-left"
          >
            <p className="flex items-center gap-2.5 text-[#FF6E00] text-sm font-medium uppercase tracking-[0.15em] mb-4">
              <span aria-hidden="true" className="h-px w-6 bg-[#FF6E00]" />
              The AI Visibility Platform for Canada
            </p>
            <h1
              className="text-black text-4xl md:text-6xl font-bold leading-tight mb-6"
              style={{ letterSpacing: "-0.03em" }}
            >
              <VerticalCutReveal
                splitBy="words"
                staggerDuration={0.07}
                staggerFrom="first"
                reverse
                transition={{ type: "spring", stiffness: 270, damping: 30, delay: 0.15 }}
              >
                Be <span className="text-[#FF6E00]">The Answer</span> AI Gives.
              </VerticalCutReveal>
            </h1>
            <p className="text-black/60 text-lg leading-relaxed max-w-xl mx-auto md:mx-0 mb-8">
              Cinder helps Canadian brands, and the agencies behind them, earn{" "}
              <strong className="font-semibold text-xl text-black">visibility</strong>{" "}
              inside{" "}
              <strong className="font-semibold text-xl text-black">
                ChatGPT, Perplexity, Gemini, and Copilot
              </strong>
              , turning AI answers into{" "}
              <span className="font-semibold text-xl text-[#FF6E00] underline decoration-2 underline-offset-4 decoration-[#FF6E00]">
                your next customer
              </span>
              .
            </p>
            <Link
              href="/contact"
              className="inline-block bg-black text-white font-medium px-8 py-3 rounded-full hover:bg-[#FF6E00] transition-colors duration-300"
            >
              Start Free
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-1/2"
          >
            <ImageAccordion />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
