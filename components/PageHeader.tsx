"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

import { revealVariants } from "@/lib/motion";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: ReactNode;
}

export default function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start mb-16">
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
      >
        <p className="flex items-center gap-2.5 text-[#FF6E00] text-sm font-medium uppercase tracking-[0.15em] mb-3">
          <span aria-hidden="true" className="h-px w-6 bg-[#FF6E00]" />
          {eyebrow}
        </p>
        <h1
          className="text-black text-4xl md:text-6xl font-bold leading-tight"
          style={{ letterSpacing: "-0.03em" }}
        >
          {title}
        </h1>
      </motion.div>
      <motion.p
        custom={1}
        initial="hidden"
        animate="visible"
        variants={revealVariants}
        className="text-black/70 text-lg md:text-xl leading-relaxed md:pt-3"
      >
        {description}
      </motion.p>
    </div>
  );
}
