"use client";

import Link from "next/link";
import { motion } from "motion/react";

import PageShell from "@/components/PageShell";
import { aiPlatforms } from "@/components/AiEngineIcons";
import { revealVariants } from "@/lib/motion";

const MAIN_IMAGE =
  "https://images.unsplash.com/photo-1744937013351-99126126c2b5?q=80&w=1400&auto=format&fit=crop";
const SECONDARY_IMAGE =
  "https://images.unsplash.com/photo-1758691737083-0e7fdbde0f05?q=80&w=900&auto=format&fit=crop";

const achievements = [
  { label: "AI Engines Tracked", value: "4+" },
  { label: "Ways To Get Named", value: "2" },
  { label: "Market Focus", value: "Canada" },
  { label: "Monitoring", value: "24/7" },
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
  return (
    <PageShell>
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="mb-14 grid gap-5 md:grid-cols-2 items-end"
      >
        <h1
          className="text-black text-4xl md:text-6xl font-medium leading-tight"
          style={{ letterSpacing: "-0.03em" }}
        >
          About Cinder
        </h1>
        <p className="text-black/70 text-lg md:text-xl leading-relaxed">
          The front door of the internet is changing. Cinder exists to make
          sure your name is the one it gives.
        </p>
      </motion.div>

      <motion.div
        custom={1}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="grid gap-4 lg:grid-cols-3 mb-16"
      >
        <img
          src={MAIN_IMAGE}
          alt="Toronto skyline, representing Cinder's Canadian focus"
          className="size-full max-h-[560px] rounded-2xl border-2 border-[#8A3220] object-cover lg:col-span-2"
        />
        <div className="flex flex-col gap-4 md:flex-row lg:flex-col">
          <div className="flex flex-col justify-between gap-6 rounded-2xl border-2 border-[#8A3220] bg-black p-7 md:w-1/2 lg:w-auto">
            <img
              src="/images/cinder-logo.png"
              alt="Cinder logo"
              className="mr-auto h-12 w-12 rounded-full object-cover"
            />
            <div>
              <p className="mb-2 text-lg font-semibold text-white">
                The future will be spoken by machines.
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                We make sure your name is in the sentence.
              </p>
            </div>
            <Link
              href="/contact"
              className="mr-auto inline-flex items-center gap-2 border border-white/30 text-white text-sm font-medium px-5 py-2 rounded-full hover:bg-white/10 transition-colors duration-200"
            >
              Get in touch
            </Link>
          </div>
          <img
            src={SECONDARY_IMAGE}
            alt="A team collaborating, representing the agencies Cinder works with"
            className="grow basis-0 rounded-2xl border-2 border-[#8A3220] object-cover md:w-1/2 lg:min-h-0 lg:w-auto"
          />
        </div>
      </motion.div>

      <motion.div
        custom={2}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="py-16 border-y border-black/10 mb-16"
      >
        <p className="text-center text-black/60 text-sm mb-8">
          Tracking your visibility across every major AI engine
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

      <motion.div
        custom={3}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="relative overflow-hidden rounded-2xl border-2 border-[#8A3220] bg-black p-10 md:p-16 mb-16"
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-white text-3xl md:text-4xl font-medium">
            Built for what&apos;s next
          </h2>
          <p className="max-w-lg text-white/60">
            Cinder is early. These are the facts that are true today, not
            projections.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap justify-between gap-10">
          {achievements.map((item) => (
            <div className="flex flex-col gap-3" key={item.label}>
              <p className="text-white/60 text-sm">{item.label}</p>
              <span className="text-white text-4xl md:text-5xl font-medium">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        custom={4}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {values.map((value) => (
          <div
            key={value.title}
            className="rounded-2xl bg-[#8A3220] p-7 min-h-56 flex flex-col justify-between"
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
    </PageShell>
  );
}
