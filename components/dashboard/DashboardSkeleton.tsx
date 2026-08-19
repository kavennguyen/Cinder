/**
 * Loading skeleton for dashboard routes.
 *
 * Shaped to mirror the real page headers (eyebrow / h1 / description) so the
 * swap from skeleton to content doesn't shift the layout. Purely presentational
 * — rendered by the route-level loading.tsx files while the server resolves
 * the org and page data.
 */

function Bar({ className = "" }: { className?: string }) {
  return <div className={`rounded bg-black/[0.07] ${className}`} />;
}

export function DashboardPageSkeleton({
  /** Rough shape of the content area below the header. */
  variant = "rows",
}: {
  variant?: "rows" | "cards" | "overview";
}) {
  return (
    <div className="animate-pulse motion-reduce:animate-none">
      {/* eyebrow */}
      <Bar className="h-3.5 w-28 mb-3" />
      {/* h1 */}
      <Bar className="h-8 md:h-9 w-80 max-w-full mb-5" />
      {/* description */}
      <Bar className="h-4 w-full max-w-xl mb-2" />
      <Bar className="h-4 w-2/3 max-w-xl mb-10" />

      {variant === "overview" && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-black/10 p-6"
              >
                <Bar className="h-3.5 w-24 mb-4" />
                <Bar className="h-9 w-20" />
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-black/10 p-6">
            <Bar className="h-3.5 w-40 mb-6" />
            <Bar className="h-48 w-full" />
          </div>
        </>
      )}

      {variant === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-black/10 p-6">
              <Bar className="h-4 w-32 mb-3" />
              <Bar className="h-3.5 w-full mb-2" />
              <Bar className="h-3.5 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {variant === "rows" && (
        <div className="flex flex-col gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-black/10 p-5 flex items-center gap-4"
            >
              <div className="flex-1">
                <Bar className="h-4 w-2/3 mb-2.5" />
                <Bar className="h-3.5 w-1/3" />
              </div>
              <Bar className="h-8 w-20 shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
