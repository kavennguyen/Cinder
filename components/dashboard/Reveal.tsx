import type { ReactNode } from "react";

/**
 * Staggered first-paint reveal, driven by a CSS animation (see .dash-reveal
 * in globals.css) rather than motion/react — a JS animation that never starts
 * would leave the section invisible, and the scoped prefers-reduced-motion
 * rule collapses this one for free.
 */
export default function Reveal({
  index = 0,
  className = "",
  children,
}: {
  index?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`dash-reveal ${className}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {children}
    </div>
  );
}
