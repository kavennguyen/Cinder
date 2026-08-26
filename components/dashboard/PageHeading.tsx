import type { ReactNode } from "react";

/** Eyebrow + display H1 + optional lede — shared by every dashboard page. */
export default function PageHeading({
  eyebrow,
  title,
  size = "md",
  children,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  /** "lg" is the Overview's org name; "md" is every sub-page. */
  size?: "md" | "lg";
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="mb-8 flex items-end justify-between gap-6 flex-wrap">
      <div className="min-w-0 max-w-2xl">
        <p className="font-ui text-ink-45 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] mb-2">
          {eyebrow}
        </p>
        <h1
          className={`font-display text-ink leading-[1.05] tracking-[-0.03em] text-balance break-words ${
            size === "lg"
              ? "text-[2rem] sm:text-[2.75rem] lg:text-[3.25rem]"
              : "text-[1.75rem] sm:text-[2.25rem]"
          }`}
        >
          {title}
        </h1>
        {children && (
          <p className="font-ui text-ink-55 text-sm leading-relaxed mt-4 max-w-xl">
            {children}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
