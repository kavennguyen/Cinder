"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { RollingList, type RollingListItem } from "@/components/ui/rolling-list";

/**
 * Steps map to what the product actually does: tracked_prompts are the
 * questions, lib/ai/engines.ts runs them across the three live engines,
 * the managed service writes the pages, and the changes table records every
 * fix against the date it shipped.
 */
const steps: RollingListItem[] = [
  {
    id: 1,
    title: "Track",
    category: "01",
    description:
      "We start with the questions your customers actually type, not keywords. Those become the prompts we watch on your behalf.",
    src: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "A team reviewing customer questions together",
  },
  {
    id: 2,
    title: "Measure",
    category: "02",
    description:
      "Every prompt is run against ChatGPT, Perplexity and Gemini on a daily cycle, so you can see who gets named and how often it is you.",
    src: "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Analytics charts on a laptop screen",
  },
  {
    id: 3,
    title: "Fix",
    category: "03",
    description:
      "Where you are missing, we write the pages the engines need to quote: direct answers, clean structure, and the details they look for.",
    src: "https://images.pexels.com/photos/669612/pexels-photo-669612.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Writing and editing content at a desk",
  },
  {
    id: 4,
    title: "Prove",
    category: "04",
    description:
      "Every change is logged with the pages it touched and the date, so a move in your score ties back to the work behind it.",
    src: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=800",
    alt: "Reviewing a report showing results",
  },
];

export default function ProcessSection() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-[minmax(0,22rem)_1fr] gap-10 md:gap-16 items-start">
        {/* Intro */}
        <div className="md:sticky md:top-32">
          <p className="flex items-center gap-2.5 text-[#FF6E00] text-sm font-medium uppercase tracking-[0.15em] mb-3">
            <span aria-hidden="true" className="h-px w-6 bg-[#FF6E00]" />
            How It Works
          </p>
          <h2
            className="text-black text-4xl md:text-5xl font-bold leading-tight mb-6"
            style={{ letterSpacing: "-0.02em" }}
          >
            Meet <span className="text-[#FF6E00]">Cinder</span>.
          </h2>
          <p className="text-black/70 text-lg leading-relaxed mb-4">
            The{" "}
            <strong className="font-semibold text-xl text-black">
              AI visibility platform
            </strong>{" "}
            built for Canada: a self service dashboard for agencies, and a done
            for you service for small businesses. One engine,{" "}
            <span className="font-semibold text-xl text-[#FF6E00] underline decoration-2 underline-offset-4 decoration-[#FF6E00]">
              two ways to get named
            </span>
            .
          </p>
          <p className="text-black/60 text-base leading-relaxed mb-8">
            Getting named is not luck. It is four repeatable steps, run
            continuously, with a record of every change we make along the way.
          </p>
          <Link
            href="/services"
            className="group inline-flex items-center gap-3 bg-black text-white text-base font-medium pl-8 pr-2 py-2 rounded-full hover:bg-[#FF6E00] transition-colors duration-200"
          >
            How it works
            <span className="bg-white rounded-full p-2">
              <ArrowRight className="w-5 h-5 text-black transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>

        {/* Steps */}
        <RollingList items={steps} />
      </div>
    </section>
  );
}
