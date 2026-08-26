import type { ReactNode } from "react";

/** Between-card heading: display face, quiet, with room for an action. */
export default function SectionHeader({
  title,
  hint,
  info,
  right,
  className = "",
}: {
  title: string;
  hint?: string;
  info?: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-end justify-between gap-4 flex-wrap ${className}`}>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <h2 className="font-display text-ink text-lg leading-snug tracking-[-0.01em]">
            {title}
          </h2>
          {info}
        </div>
        {hint && (
          <p className="font-ui text-ink-45 text-xs mt-1 leading-relaxed">{hint}</p>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
