"use client";

import { useState } from "react";

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
      "See exactly how ChatGPT, Perplexity, Gemini, and Copilot describe your brand today, and where you're being left out of the answer.",
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
    <div
      className={`relative h-[360px] md:h-[420px] shrink-0 snap-center rounded-2xl overflow-hidden cursor-pointer transition-[width] duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isActive
          ? "w-[228px] md:w-[320px]"
          : "w-[48px] md:w-[56px]"
      }`}
      // Pointer-type guard: on touch devices a tap emits a synthetic mouse
      // enter as well as a click, which fired two competing state updates
      // and made the panel flicker. Only mice drive the hover behaviour.
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

      {/* Title and description stay mounted and cross-fade, so the words
          ease in and out instead of popping. Only opacity/transform
          animate, which the compositor can handle without relayout. */}
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
        // Fixed width rather than inset-0: the card animates 48px -> 228px, and
        // an overlay that tracked that width would re-wrap the text on every
        // frame. Pinning it to the open width means the copy is laid out once
        // and only fades. Overflow is clipped by the card while collapsed.
        className={`absolute inset-y-0 left-0 w-[228px] md:w-[320px] flex flex-col justify-end p-5 md:p-6 transition-opacity duration-[800ms] ease-out ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <h3
          className={`text-white text-lg md:text-xl font-semibold mb-2 transition-opacity md:transition-all duration-[800ms] delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isOpen ? "opacity-100 md:translate-y-0" : "opacity-0 md:translate-y-3"
          }`}
        >
          {item.title}
        </h3>
        <p
          className={`text-white/80 text-[13px] md:text-sm leading-relaxed transition-opacity md:transition-all duration-[800ms] delay-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isOpen ? "opacity-100 md:translate-y-0" : "opacity-0 md:translate-y-3"
          }`}
        >
          {item.description}
        </p>
      </div>
    </div>
  );
}

export function ImageAccordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function handleHover(index: number) {
    // Hovering now expands AND reveals the description together, so desktop
    // users never need to click at all — mousing across the row is enough.
    setActiveIndex(index);
    setOpenIndex(index);
  }

  function handleClick(index: number) {
    // Touch devices have no hover, so a tap has to do everything at once:
    // expand the card and reveal its description. Tapping an already-open
    // card keeps it open rather than toggling it shut, so the info never
    // disappears out from under a thumb.
    const isTouch =
      typeof window !== "undefined" &&
      !window.matchMedia("(hover: hover)").matches;

    if (isTouch) {
      setActiveIndex(index);
      setOpenIndex(index);
      return;
    }

    // On desktop, hover already opens the card. A click just keeps it locked
    // open at the current index (useful for touchpad/keyboard users, and a
    // no-op in the common hover-driven case).
    setActiveIndex(index);
    setOpenIndex(index);
  }

  return (
    <div className="flex flex-row items-center justify-start md:justify-center gap-2.5 md:gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
