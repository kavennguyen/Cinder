import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  let email: string | null = null;

  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? null;
  }

  return (
    <div className="max-w-5xl">
      <p className="text-black/60 text-sm mb-2">Overview</p>
      <h1
        className="text-black text-3xl md:text-5xl font-medium leading-tight mb-4"
        style={{ letterSpacing: "-0.03em" }}
      >
        Welcome{email ? `, ${email}` : ""}.
      </h1>
      <p className="text-black/60 text-base leading-relaxed max-w-xl mb-12">
        This is the Cinder dashboard shell. AI visibility tracking, SEO
        metrics, and the change log will land here next.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "AI Visibility Score", value: "—" },
          { label: "Tracked Prompts", value: "—" },
          { label: "Changes Logged", value: "—" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-black/10 p-6"
          >
            <p className="text-black/60 text-sm mb-2">{card.label}</p>
            <p
              className="text-black text-4xl font-medium"
              style={{ letterSpacing: "-0.02em" }}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
