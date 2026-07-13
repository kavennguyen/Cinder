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
      className={`relative h-[420px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-in-out ${
        isActive ? "w-[320px]" : "w-[56px]"
      }`}
      onMouseEnter={onHover}
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
        className={`absolute inset-0 transition-colors duration-500 ${
          isOpen ? "bg-black/70" : "bg-black/40"
        }`}
      />

      {!isOpen && (
        <span
          className={`absolute text-white text-lg font-semibold whitespace-nowrap transition-all duration-300 ease-in-out ${
            isActive
              ? "bottom-6 left-1/2 -translate-x-1/2 rotate-0"
              : "w-auto text-left bottom-24 left-1/2 -translate-x-1/2 rotate-90"
          }`}
        >
          {item.title}
        </span>
      )}

      {isOpen && (
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3 className="text-white text-xl font-semibold mb-2">
            {item.title}
          </h3>
          <p className="text-white/80 text-sm leading-relaxed">
            {item.description}
          </p>
        </div>
      )}
    </div>
  );
}

export function ImageAccordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function handleHover(index: number) {
    setActiveIndex(index);
    setOpenIndex(null);
  }

  function handleClick(index: number) {
    if (index === activeIndex && openIndex === index) {
      setOpenIndex(null);
    } else {
      setActiveIndex(index);
      setOpenIndex(index);
    }
  }

  return (
    <div className="flex flex-row items-center justify-center gap-3 overflow-x-auto p-4">
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
