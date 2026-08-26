import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Supporting metadata — a labelled number in a list, not a headline card.
 * Deliberately low visual weight: these lost their equal footing with the
 * visibility score on purpose.
 */
export default function Stat({
  label,
  value,
  href,
  hint,
}: {
  label: string;
  value: string;
  href?: string;
  hint?: string;
}) {
  const body = (
    <>
      <span className="font-ui text-ink-55 text-sm">{label}</span>
      <span className="flex items-center gap-1.5">
        <span className="font-ui text-ink text-sm font-medium tabular-nums">
          {value}
        </span>
        {href && (
          <ArrowUpRight className="w-3.5 h-3.5 text-ink-45 group-hover:text-ember transition-colors duration-200" />
        )}
      </span>
    </>
  );

  const shell = "flex items-center justify-between gap-4 py-3";

  return (
    <div className="border-b border-rule last:border-0">
      {href ? (
        <Link href={href} className={`group ${shell} focus-ring rounded-sm`}>
          {body}
        </Link>
      ) : (
        <div className={shell}>{body}</div>
      )}
      {hint && <p className="font-ui text-ink-45 text-xs pb-3 -mt-2">{hint}</p>}
    </div>
  );
}
