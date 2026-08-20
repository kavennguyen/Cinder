"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, X } from "lucide-react";

import PageShell from "@/components/PageShell";
import { aiPlatforms } from "@/components/AiEngineIcons";
import { revealVariants } from "@/lib/motion";

const MAIN_IMAGE =
  "https://images.unsplash.com/photo-1744937013351-99126126c2b5?q=80&w=1400&auto=format&fit=crop";

/** Facts that are true today, not projections. Three engines run live. */
const inlineStats = [
  { value: "3", label: "engines live" },
  { value: "2", label: "ways to get named" },
];

const values = [
  {
    title: "Transparency",
    body: "You see exactly what we track, what we change, and why, with no black box reporting.",
  },
  {
    title: "Accuracy",
    body: "We only optimize for citations that are true. Being cited by AI means nothing if the answer is wrong.",
  },
  {
    title: "Speed",
    body: "AI platforms update constantly. We move at the same pace, not on a quarterly review cycle.",
  },
];

export default function AboutContent() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <PageShell>
      <div ref={sectionRef}>
        {/* Eyebrow + social, sitting above the image */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={revealVariants}
          className="flex items-center justify-between mb-5"
        >
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="h-px w-6 bg-[#FF6E00]" />
            <span className="text-[#FF6E00] text-sm font-medium tracking-[0.15em] uppercase">
              Who We Are
            </span>
          </div>
          <a
            href="https://x.com/CinderSource"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Cinder on X"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 text-black/50 transition-colors hover:border-black/20 hover:text-black"
          >
            <X className="h-4 w-4" />
          </a>
        </motion.div>

        <motion.p
          custom={1}
          initial="hidden"
          animate="visible"
          variants={revealVariants}
          className="text-black text-4xl md:text-6xl font-bold leading-tight mb-8 max-w-4xl"
          style={{ letterSpacing: "-0.03em" }}
        >
          A homegrown startup in the{" "}
          <span className="text-[#FF6E00]">heart of Toronto</span>.
        </motion.p>

        {/* Hero image */}
        <motion.img
          custom={2}
          initial="hidden"
          animate="visible"
          variants={revealVariants}
          src={MAIN_IMAGE}
          alt="Toronto skyline, representing Cinder's Canadian focus"
          className="w-full max-h-[420px] rounded-2xl object-cover"
        />

        {/* Stats */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={revealVariants}
          className="flex flex-wrap items-start justify-between gap-6 py-6 border-b border-black/10 mb-12"
        >
          <div className="flex flex-wrap items-center gap-4">
            {inlineStats.map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-2 text-sm">
                <span className="text-[#FF6E00] font-semibold text-base">
                  {stat.value}
                </span>
                <span className="text-black/60">{stat.label}</span>
                {i < inlineStats.length - 1 && (
                  <span className="text-black/20 ml-2">|</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start sm:items-end gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-[#FF6E00] text-3xl md:text-4xl font-semibold">
                Canada
              </span>
              <span className="text-black/60 text-sm uppercase tracking-wide">
                market focus
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#FF6E00] font-semibold text-base">
                24/7
              </span>
              <span className="text-black/60">monitoring</span>
            </div>
          </div>
        </motion.div>

        {/* Headline + body + CTA column */}
        <div className="grid md:grid-cols-3 gap-10 md:gap-8 mb-16">
          <div className="md:col-span-2">
            <h1
              className="text-black text-4xl md:text-6xl font-bold leading-tight mb-8"
              style={{ letterSpacing: "-0.03em" }}
            >
              The future will be spoken by you.
            </h1>

            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={revealVariants}
              className="grid md:grid-cols-2 gap-8"
            >
              <p className="text-black/70 text-lg md:text-xl leading-relaxed">
                The way people{" "}
                <strong className="font-semibold text-xl md:text-2xl text-black">
                  search things on the internet
                </strong>{" "}
                is changing. They ask an assistant instead of scrolling a
                results page, and the answer names one business rather than
                ten.
              </p>
              <p className="text-black/70 text-lg md:text-xl leading-relaxed">
                Cinder exists to make sure your name is{" "}
                <span className="font-semibold text-xl md:text-2xl text-[#FF6E00] underline decoration-2 underline-offset-4 decoration-[#FF6E00]">
                  the one it gives
                </span>
                . We measure where you stand across the answer engines, then do
                the work that puts you in the sentence.
              </p>
            </motion.div>
          </div>

          <motion.div
            custom={5}
            initial="hidden"
            animate="visible"
            variants={revealVariants}
            className="md:col-span-1 md:text-right"
          >
            <p className="text-[#FF6E00] text-2xl font-semibold mb-1">Cinder</p>
            <p className="text-black/60 text-sm mb-8">
              AI Visibility · Built in Toronto
            </p>
            <p className="text-black font-medium mb-5">
              Ready to be the name AI gives?
            </p>
            <Link
              href="/contact"
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-black px-6 py-3 font-medium text-white transition-colors duration-300 hover:bg-[#FF6E00] md:ml-auto"
            >
              Get in touch
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Engines */}
        <motion.div
          custom={6}
          initial="hidden"
          animate="visible"
          variants={revealVariants}
          className="py-14 border-y border-black/10 mb-16"
        >
          <p className="text-center text-black/60 text-sm mb-8">
            Live today across{" "}
            <strong className="font-semibold text-base text-black">
              ChatGPT, Perplexity and Gemini
            </strong>
            . Claude and Copilot are next.
          </p>
          <div className="flex flex-wrap justify-center gap-10">
            {aiPlatforms.map((platform) => (
              <div
                key={platform.name}
                className="flex items-center gap-2.5 text-black/70"
              >
                {platform.icon}
                <span className="text-base font-medium">{platform.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Values */}
        <motion.div
          custom={7}
          initial="hidden"
          animate="visible"
          variants={revealVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {values.map((value) => (
            <div
              key={value.title}
              className="rounded-2xl bg-[#FF6E00] p-7 min-h-56 flex flex-col justify-between"
            >
              <h3 className="text-white text-xl font-medium leading-snug">
                {value.title}
              </h3>
              <p className="text-white/60 text-sm leading-relaxed">
                {value.body}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </PageShell>
  );
}
