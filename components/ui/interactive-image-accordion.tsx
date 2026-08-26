"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

interface AccordionPillar {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

const pillars: AccordionPillar[] = [
  {
    id: 1,
    title: "AI Visibility",
    description:
      "See exactly how ChatGPT, Perplexity and Gemini describe your brand today, and which questions you are being left out of entirely.",
    imageUrl:
      "https://images.unsplash.com/photo-1666601384272-e3e55227d33a?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "AEO Dashboards",
    description:
      "Track citations, rankings, and share of voice across every major AI engine in one dashboard, built for agencies managing multiple clients.",
    imageUrl:
      "https://images.pexels.com/photos/3912976/pexels-photo-3912976.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&dpr=1",
  },
  {
    id: 3,
    title: "Website Optimization",
    description:
      "Structured data, source friendly content, and technical fixes that make your site easy for AI models to cite accurately.",
    imageUrl:
      "https://images.unsplash.com/photo-1762242298589-582f5f6c3fb1?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Agentic Customization",
    description:
      "Configure automated agents that continuously adjust your content and structured data as AI models change how they cite sources.",
    imageUrl:
      "https://images.unsplash.com/photo-1783692218364-a97c219b0f67?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Streamlined Workflows",
    description:
      "Replace scattered tools and manual prompting with one repeatable workflow, so your team spends time on strategy instead of busywork.",
    imageUrl:
      "https://images.unsplash.com/photo-1782760794099-dc5a50bd55a6?q=80&w=1200&auto=format&fit=crop",
  },
];

// ---------------------------------------------------------------------------
// Desktop: horizontal width-accordion, unchanged from the version already
// confirmed to feel right there. Hidden below md.
// ---------------------------------------------------------------------------

interface AccordionItemProps {
  item: AccordionPillar;
  isActive: boolean;
  isOpen: boolean;
  onHover: () => void;
  onClick: () => void;
}

function AccordionItem({
  item,
  isActive,
  isOpen,
  onHover,
  onClick,
}: AccordionItemProps) {
  return (
    <motion.div
      layout
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative h-[420px] shrink-0 rounded-2xl overflow-hidden cursor-pointer ${
        isActive ? "w-[320px]" : "w-[56px]"
      }`}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") onHover();
      }}
      onClick={onClick}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.onerror = null;
          img.src = "https://placehold.co/400x450/1a1815/ffffff?text=Cinder";
        }}
      />
      <div
        className={`absolute inset-0 transition-colors duration-[800ms] ${
          isOpen ? "bg-black/70" : "bg-black/40"
        }`}
      />

      <span
        className={`absolute text-white text-lg font-semibold whitespace-nowrap transition-all duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "opacity-0" : "opacity-100"
        } ${
          isActive
            ? "bottom-6 left-1/2 -translate-x-1/2 rotate-0"
            : "w-auto text-left bottom-24 left-1/2 -translate-x-1/2 rotate-90"
        }`}
      >
        {item.title}
      </span>

      <div
        aria-hidden={!isOpen}
        className={`absolute inset-y-0 left-0 w-[320px] flex flex-col justify-end p-6 transition-opacity duration-[800ms] ease-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <h3
          className={`text-white text-xl font-semibold mb-2 transition-all duration-[800ms] delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          {item.title}
        </h3>
        <p
          className={`text-white/80 text-sm leading-relaxed transition-all duration-[800ms] delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isOpen ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

function DesktopAccordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function handleHover(index: number) {
    setActiveIndex(index);
    setOpenIndex(index);
  }

  function handleClick(index: number) {
    setActiveIndex(index);
    setOpenIndex(index);
  }

  return (
    <div className="hidden md:flex flex-row items-center justify-center gap-3 p-4">
      {pillars.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          isActive={index === activeIndex}
          isOpen={openIndex === index}
          onHover={() => handleHover(index)}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile: vertical stacked list, all five titles on screen at once. Tapping
// expands height in place instead of animating width across a scrolling row —
// no sibling reflow to fight, and rapid taps between far-apart rows cost the
// same as taps between adjacent ones, since only height changes.
// ---------------------------------------------------------------------------

function MobileAccordionItem({
  item,
  isOpen,
  onClick,
}: {
  item: AccordionPillar;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-black/10 last:border-b-0">
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3 py-4 text-left"
      >
        <img
          src={item.imageUrl}
          alt={item.title}
          className="h-14 w-14 shrink-0 rounded-xl object-cover"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.onerror = null;
            img.src = "https://placehold.co/200x200/1a1815/ffffff?text=Cinder";
          }}
        />
        <span className="flex-1 text-black text-base font-semibold">
          {item.title}
        </span>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-black/40 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-4 pl-[68px] pr-2 text-sm leading-relaxed text-black/60">
              {item.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex md:hidden flex-col rounded-2xl border border-black/10 px-4">
      {pillars.map((item, index) => (
        <MobileAccordionItem
          key={item.id}
          item={item}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}

export function ImageAccordion() {
  return (
    <>
      <DesktopAccordion />
      <MobileAccordion />
    </>
  );
}
