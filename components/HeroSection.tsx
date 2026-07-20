"use client";

import Link from "next/link";
import { motion } from "motion/react";

import { ImageAccordion } from "./ui/interactive-image-accordion";

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
            <p className="text-black/60 text-sm font-medium tracking-[0.15em] uppercase mb-4">
              The AI Visibility Platform for Canada
            </p>
            <h1
              className="text-black text-4xl md:text-6xl font-medium leading-tight mb-6"
              style={{ letterSpacing: "-0.03em" }}
            >
              Be The Answer AI Gives.
            </h1>
            <p className="text-black/60 text-lg leading-relaxed max-w-xl mx-auto md:mx-0 mb-8">
              Cinder helps Canadian brands, and the agencies behind them, earn
              visibility inside ChatGPT, Perplexity, Gemini, and Copilot,
              turning AI answers into your next customer.
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
