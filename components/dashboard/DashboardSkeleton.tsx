/**
 * Loading skeletons for the dashboard routes.
 *
 * Each variant mirrors the real page it stands in for — same wrappers, same
 * spacing, same warm tokens — so the swap from skeleton to content doesn't
 * shift the layout or flash a different visual language. Purely presentational;
 * rendered by the route-level loading.tsx files while the server resolves the
 * org and page data.
 *
 * Kept deliberately in step with:
 *   PageHeading · ScoreHero · WeekSummary · ui/Card · ui/Stat · ui/SectionHeader
 * If those change shape, change these too.
 */

/** A placeholder line. `bg-rule` reads on both ground and paper. */
function Bar({ className = "" }: { className?: string }) {
  return <div className={`rounded bg-rule ${className}`} />;
}

/** Placeholder for a pill Button (md: text-sm px-5 py-2.5). */
function Pill({ className = "" }: { className?: string }) {
  return <div className={`rounded-full bg-rule h-10 ${className}`} />;
}

/** Mirrors ui/Card: the one surface — paper on ground, hairline, no shadow. */
function CardBox({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border border-rule bg-paper ${className}`}>
      {children}
    </div>
  );
}

/** Mirrors ui/Stat and WeekSummary's Line: a py-3 row on a hairline. */
function LineRow({ wide = false }: { wide?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3 border-b border-rule last:border-0">
      <Bar className={`h-3.5 ${wide ? "w-36" : "w-28"}`} />
      <Bar className="h-3.5 w-16" />
    </div>
  );
}

/** Mirrors PageHeading: eyebrow / display h1 / optional lede / optional action. */
function Heading({
  size = "md",
  lede = 0,
  action = false,
}: {
  size?: "md" | "lg";
  /** Number of lede lines the real page renders, 0 for none. */
  lede?: number;
  action?: boolean;
}) {
  return (
    <header className="mb-8 flex items-end justify-between gap-6 flex-wrap">
      <div className="min-w-0 max-w-2xl w-full">
        <Bar className="h-3 w-28 mb-2" />
        {size === "lg" ? (
          <Bar className="h-9 sm:h-12 lg:h-14 w-64 max-w-full" />
        ) : (
          <Bar className="h-8 sm:h-10 w-72 max-w-full" />
        )}
        {lede > 0 && (
          <div className="mt-4 max-w-xl">
            {Array.from({ length: lede }).map((_, i) => (
              <Bar
                key={i}
                className={`h-3.5 mb-2 last:mb-0 ${
                  i === lede - 1 ? "w-2/3" : "w-full"
                }`}
              />
            ))}
          </div>
        )}
      </div>
      {action && <Pill className="w-36 shrink-0" />}
    </header>
  );
}

/** Mirrors ui/SectionHeader: display-face heading with room for an action. */
function SectionBar({ right = false }: { right?: boolean }) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap mb-4">
      <Bar className="h-5 w-40" />
      {right && <Bar className="h-3.5 w-12" />}
    </div>
  );
}

/** Mirrors a PromptsManager / BrandsManager / ChangesManager list row. */
function ListRows({ count = 4 }: { count?: number }) {
  return (
    <ul className="flex flex-col gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <li
          key={i}
          className="rounded-2xl border border-rule bg-paper px-5 py-4 flex items-center justify-between gap-4"
        >
          <div className="min-w-0 flex-1">
            <Bar className="h-3.5 w-2/3 mb-2.5" />
            <div className="flex items-center gap-2">
              <Bar className="h-3 w-24" />
              <Bar className="h-4 w-16 rounded-full" />
              <Bar className="h-4 w-16 rounded-full" />
            </div>
          </div>
          <Bar className="h-4 w-4 shrink-0 rounded-full" />
        </li>
      ))}
    </ul>
  );
}

export function DashboardPageSkeleton({
  variant = "prompts",
}: {
  /** Each maps to one dashboard route. */
  variant?: "overview" | "prompts" | "brands" | "changes";
}) {
  return (
    <div
      role="status"
      aria-busy="true"
      className="animate-pulse motion-reduce:animate-none"
    >
      <span className="sr-only">Loading…</span>

      {variant === "overview" && (
        <>
          <Heading size="lg" />

          <div className="flex flex-col gap-4">
            {/* ScoreHero — the "live" shape, which is the steady state for any
                org with data. A brand-new org sees it for one paint only. */}
            <section className="rounded-hero border border-rule bg-paper p-6 sm:p-8 lg:p-10">
              <Bar className="h-3 w-44" />
              <div className="flex flex-wrap items-end gap-x-6 gap-y-3 mt-4">
                <Bar className="h-14 sm:h-20 lg:h-24 w-44 sm:w-56" />
                <Bar className="h-4 w-52 mb-2 sm:mb-3" />
              </div>
              <Bar className="h-3 w-64 max-w-full mt-4" />

              <div className="border-t border-rule mt-7 pt-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                  {[0, 1, 2].map((i) => (
                    <div key={i}>
                      <Bar className="h-4 w-28 mb-2" />
                      <Bar className="h-8 w-20" />
                      <div className="h-1 rounded-full bg-wash mt-3" />
                      <Bar className="h-3 w-40 max-w-full mt-2" />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* WeekSummary / OverviewChecklist + the Stat rail */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <CardBox className="lg:col-span-2 p-5 sm:p-6">
                <Bar className="h-3 w-24" />
                <div className="mt-4">
                  <LineRow wide />
                  <LineRow wide />
                  <LineRow wide />
                  <LineRow wide />
                </div>
              </CardBox>

              <CardBox className="px-5 sm:px-6 py-2">
                <LineRow />
                <LineRow />
                <LineRow />
              </CardBox>
            </div>

            {/* VisibilityChart + ShareOfVoiceChart */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <CardBox className="lg:col-span-7 min-w-0 p-5 sm:p-6">
                <Bar className="h-3 w-32 mb-6" />
                <Bar className="h-56 w-full" />
              </CardBox>
              <CardBox className="lg:col-span-5 min-w-0 p-5 sm:p-6">
                <Bar className="h-3 w-32 mb-6" />
                <Bar className="h-56 w-full" />
              </CardBox>
            </div>
          </div>
        </>
      )}

      {variant === "prompts" && (
        <div>
          <Heading lede={3} action />
          <div className="max-w-3xl">
            {/* Add form: input + Add button, then the platform chips */}
            <div className="mb-10">
              <Bar className="h-3.5 w-40 mb-2" />
              <div className="flex gap-2">
                <Bar className="h-11 flex-1 rounded-full" />
                <Pill className="h-11 w-24 shrink-0" />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {[0, 1, 2, 3].map((i) => (
                  <Bar key={i} className="h-7 w-24 rounded-full" />
                ))}
              </div>
            </div>

            <SectionBar right />
            <ListRows count={5} />
          </div>
        </div>
      )}

      {variant === "brands" && (
        <div>
          <Heading lede={2} />
          <div className="max-w-3xl">
            {/* Add form: name + domain + Add, then the competitor checkbox */}
            <div className="mb-10">
              <Bar className="h-3.5 w-28 mb-2" />
              <div className="flex gap-2 flex-wrap">
                <Bar className="h-11 flex-1 min-w-40 rounded-full" />
                <Bar className="h-11 flex-1 min-w-40 rounded-full" />
                <Pill className="h-11 w-24 shrink-0" />
              </div>
              <Bar className="h-3.5 w-44 mt-3" />
            </div>

            <div className="mb-10">
              <SectionBar />
              <ListRows count={1} />
            </div>

            <SectionBar right />
            <ListRows count={3} />
          </div>
        </div>
      )}

      {variant === "changes" && (
        <div>
          <Heading lede={3} />
          <div className="max-w-3xl">
            {/* Log form: title + type, url, details, submit */}
            <div className="mb-10 flex flex-col gap-3">
              <div className="flex gap-2 flex-wrap">
                <Bar className="h-11 flex-1 min-w-60 rounded-full" />
                <Bar className="h-11 w-40 rounded-full" />
              </div>
              <Bar className="h-11 w-full rounded-full" />
              <Bar className="h-16 w-full rounded-2xl" />
              <Pill className="w-36" />
            </div>

            <SectionBar />
            <ListRows count={4} />
          </div>
        </div>
      )}
    </div>
  );
}
