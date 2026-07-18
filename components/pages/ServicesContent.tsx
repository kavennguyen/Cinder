"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";

import PageShell from "@/components/PageShell";
import { revealVariants } from "@/lib/motion";

const chartLines = [
  {
    name: "Cinder",
    color: "#8A3220",
    points: "0,190 103,175 206,168 309,150 412,120 514,90 617,55 720,30",
  },
  {
    name: "Competitor A",
    color: "rgba(0,0,0,0.35)",
    points: "0,70 103,75 206,72 309,80 412,85 514,90 617,95 720,100",
  },
  {
    name: "Competitor B",
    color: "rgba(0,0,0,0.18)",
    points: "0,130 103,128 206,132 309,135 412,130 514,128 617,125 720,120",
  },
];

const statCards = [
  {
    label: "AI Citations Tracked",
    value: "3,181",
    breakdown: [
      { name: "ChatGPT", value: "1,240" },
      { name: "Perplexity", value: "980" },
      { name: "Gemini", value: "640" },
    ],
  },
  {
    label: "Average Citation Position",
    value: "2.1",
    breakdown: [
      { name: "ChatGPT", value: "1.8" },
      { name: "Perplexity", value: "2.3" },
      { name: "Gemini", value: "2.4" },
    ],
  },
];

const agencyFeatures = [
  "Track AI visibility across every client, in one dashboard",
  "Benchmark share of voice against competitors",
  "See exactly which sources get cited, and where the gaps are",
  "Surface the highest impact actions to take next",
  "White label reports under your own brand",
  "Multiple client workspaces",
];

const smallBusinessFeatures = [
  "The same platform that powers our dashboard, run by our team, for you",
  "Billed as an ongoing monthly retainer, not a one time project",
  "No need to hire or learn a new discipline",
  "You run your business. We make sure AI recommends it.",
];

export default function ServicesContent() {
  return (
    <PageShell>
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start mb-16"
      >
        <div>
          <p className="text-black/60 text-sm mb-2">What We Do</p>
          <h1
            className="text-black text-4xl md:text-6xl font-medium leading-tight"
            style={{ letterSpacing: "-0.03em" }}
          >
            The tools to see it.
            <br />
            The team to do it.
          </h1>
        </div>
        <p className="text-black/70 text-lg md:text-xl leading-relaxed md:pt-3">
          Cinder is an AI visibility platform for the age of answer engines.
          However you want to win AI search, we have a way in: a dashboard
          for agencies, and a done for you service for small businesses.
        </p>
      </motion.div>

      {/* Open preview section - the dashboard, in practice */}
      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 mb-24"
      >
        <div className="rounded-2xl border border-black/10 bg-white/40 p-8 md:p-12">
          <p className="text-black/60 text-sm mb-2">See The Dashboard</p>
          <h2
            className="text-black text-4xl md:text-5xl font-medium leading-tight mb-8 max-w-xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            This is what tracking your AI visibility looks like
          </h2>

          <svg viewBox="0 0 720 240" className="w-full h-auto mb-6">
            {[0, 60, 120, 180, 240].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="720"
                y2={y}
                stroke="rgba(0,0,0,0.08)"
                strokeWidth="1"
              />
            ))}
            {chartLines.map((line) => (
              <polyline
                key={line.name}
                points={line.points}
                fill="none"
                stroke={line.color}
                strokeWidth={line.name === "Cinder" ? 4 : 3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </svg>

          <div className="flex flex-wrap gap-6">
            {chartLines.map((line) => (
              <div key={line.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: line.color }}
                />
                <span className="text-black/70 text-sm font-medium">
                  {line.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-black/10 bg-white/40 p-6 flex-1"
            >
              <p className="text-black/60 text-sm mb-2">{card.label}</p>
              <p
                className="text-black text-4xl font-medium mb-4"
                style={{ letterSpacing: "-0.02em" }}
              >
                {card.value}
              </p>
              <div className="flex flex-col gap-1.5">
                {card.breakdown.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-black/60">{item.name}</span>
                    <span className="text-black/80 font-medium">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Track 1 - Agencies */}
      <motion.div
        id="agencies"
        custom={2}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="scroll-mt-32 pt-16 border-t border-black/10 mb-24"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start mb-10">
          <div>
            <p className="text-black/60 text-sm mb-2">For Agencies</p>
            <h2
              className="text-black text-4xl md:text-5xl font-medium leading-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              Every client&apos;s AI visibility, in one place.
            </h2>
          </div>
          <p className="text-black/70 text-lg leading-relaxed md:pt-3">
            The Cinder dashboard is built for agencies who want to offer AI
            visibility as a service without building the machinery themselves.
            What used to take scattered tools, manual prompting, and guesswork
            becomes one clean, repeatable workflow, so your team spends time on
            strategy instead of assembly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {agencyFeatures.map((feature) => (
            <div
              key={feature}
              className="rounded-2xl bg-black p-6 flex items-start gap-3"
            >
              <Check className="w-4 h-4 mt-1 shrink-0 text-[#8A3220]" />
              <p className="text-white/80 text-sm leading-relaxed">
                {feature}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/contact"
          className="inline-flex items-center gap-3 bg-black text-white text-base font-medium pl-8 pr-2 py-2 rounded-full hover:bg-[#8A3220] transition-colors duration-200"
        >
          Start Free
          <span className="bg-white rounded-full p-2">
            <ArrowRight className="w-5 h-5 text-black" />
          </span>
        </Link>
      </motion.div>

      {/* Track 2 - Small Business */}
      <motion.div
        id="small-business"
        custom={3}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="scroll-mt-32 pt-16 border-t border-black/10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start mb-10">
          <div>
            <p className="text-black/60 text-sm mb-2">For Small Business</p>
            <h2
              className="text-black text-4xl md:text-5xl font-medium leading-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              AI visibility, done for you.
            </h2>
          </div>
          <p className="text-black/70 text-lg leading-relaxed md:pt-3">
            Most small businesses don&apos;t have the time or the specialist
            knowledge to optimize for AI search, and they shouldn&apos;t have to.
            Our team does it for them, using the same platform that powers
            our dashboard, so you show up in the AI answers your customers
            are already asking, from the questions they type into ChatGPT to
            the recommendations they trust.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {smallBusinessFeatures.map((feature) => (
            <div
              key={feature}
              className="rounded-2xl bg-[#8A3220] p-6 flex items-start gap-3"
            >
              <Check className="w-4 h-4 mt-1 shrink-0 text-white" />
              <p className="text-white/80 text-sm leading-relaxed">
                {feature}
              </p>
            </div>
          ))}
        </div>

        <Link
          href="/contact"
          className="inline-flex items-center gap-3 bg-black text-white text-base font-medium pl-8 pr-2 py-2 rounded-full hover:bg-[#8A3220] transition-colors duration-200"
        >
          Get a Free Audit
          <span className="bg-white rounded-full p-2">
            <ArrowRight className="w-5 h-5 text-black" />
          </span>
        </Link>
      </motion.div>
    </PageShell>
  );
}
