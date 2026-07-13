import { motion } from "motion/react";

import PageShell from "../components/PageShell";
import PageHeader from "../components/PageHeader";
import { revealVariants } from "../lib/motion";

const caseStudies = [
  {
    name: "Maple & Co.",
    category: "Retail",
    year: "2026",
    stat: "3.4x",
    image:
      "https://images.pexels.com/photos/3912976/pexels-photo-3912976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=1000&dpr=1",
  },
  {
    name: "Northline",
    category: "Ecommerce",
    year: "2025 to 2026",
    stat: "#1",
    image:
      "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1260&h=1000&dpr=1",
  },
  {
    name: "Sterling Digital",
    category: "Professional Services",
    year: "2026",
    stat: "62%",
    image:
      "https://images.pexels.com/photos/669612/pexels-photo-669612.jpeg?auto=compress&cs=tinysrgb&w=1260&h=1000&dpr=1",
  },
  {
    name: "Birchwood",
    category: "Retail",
    year: "2025",
    stat: "4.8x",
    image:
      "https://images.pexels.com/photos/30768276/pexels-photo-30768276.jpeg?auto=compress&cs=tinysrgb&w=1260&h=1000&dpr=1",
  },
];

export default function CaseStudies() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Results"
        title="Case Studies"
        description="A look at how Cinder has helped brands earn visibility inside AI generated answers. Placeholder results shown below."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {caseStudies.map((study, index) => (
          <motion.div
            key={study.name}
            custom={2 + index}
            initial="hidden"
            animate="visible"
            variants={revealVariants}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={study.image}
                alt={`${study.name} case study`}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 left-4 bg-black/70 backdrop-blur text-white text-sm font-medium px-3 py-1 rounded-full">
                {study.stat}
              </span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-black font-medium">{study.name}</span>
              <span className="text-black/50 text-sm">{study.year}</span>
            </div>
            <div className="text-black/50 text-sm">{study.category}</div>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}
