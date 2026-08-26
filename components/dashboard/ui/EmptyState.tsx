import type { ReactNode } from "react";

/**
 * Empty states are first-class: a headline that says what will be here, one
 * line of why, and — where there's an action — the way to get there.
 */
export default function EmptyState({
  icon,
  title,
  children,
  action,
  className = "",
}: {
  icon?: ReactNode;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-dashed border-rule-strong bg-paper/60 px-6 py-8 ${className}`}
    >
      {icon && <div className="text-ink-45 mb-3">{icon}</div>}
      <p className="font-display text-ink text-lg leading-snug tracking-[-0.01em]">
        {title}
      </p>
      {children && (
        <p className="font-ui text-ink-55 text-sm leading-relaxed mt-2 max-w-md">
          {children}
        </p>
      )}
      {action && <div className="mt-5 flex flex-wrap gap-3">{action}</div>}
    </div>
  );
}
