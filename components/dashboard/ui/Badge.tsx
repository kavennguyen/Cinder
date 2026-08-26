import type { ReactNode } from "react";

export type BadgeTone = "solid" | "outline" | "muted" | "alert" | "accent";

const tones: Record<BadgeTone, string> = {
  /** Positive / present — black pill, the existing convention. */
  solid: "bg-ink text-paper",
  /** Absent / neutral. */
  outline: "border border-rule-strong text-ink-55",
  /** Metadata, not a result. */
  muted: "bg-wash text-ink-55",
  /** Failure. */
  alert: "border border-ember/40 text-ember",
  /** "You" — the one place ember carries identity rather than data. */
  accent: "bg-ember text-paper",
};

export default function Badge({
  tone = "outline",
  className = "",
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-ui text-[0.6875rem] font-medium px-2.5 py-1 tabular-nums ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
