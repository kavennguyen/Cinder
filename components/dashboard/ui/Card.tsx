import type { ReactNode } from "react";

/** The one surface in the dashboard: paper on ground, hairline, no shadow. */
export function Card({
  className = "",
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`rounded-2xl border border-rule bg-paper ${className}`}>
      {children}
    </div>
  );
}

/** Card title row: eyebrow-weight label, optional info affordance and right slot. */
export function CardHeader({
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
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <h2 className="text-ink-55 text-[0.6875rem] font-semibold uppercase tracking-[0.09em]">
            {title}
          </h2>
          {info}
        </div>
        {hint && <p className="text-ink-45 text-xs mt-1 leading-relaxed">{hint}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}
