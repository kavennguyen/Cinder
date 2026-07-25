"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  // Instantiating the browser client exchanges the ?code= from the recovery
  // email link for a session (detectSessionInUrl). Do it on mount so the
  // session is ready by the time the user submits.
  useEffect(() => {
    if (isSupabaseConfigured()) createClient();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isSupabaseConfigured()) {
      setError(
        "Supabase isn't connected yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
      );
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      // No session means the recovery link was bad, reused, or expired.
      if (/session|jwt|token/i.test(error.message)) {
        setExpired(true);
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 selection:bg-[#8A3220] selection:text-white">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="flex items-center gap-2 mb-10">
          <img
            src="/images/cinder-logo.png"
            alt="Cinder logo"
            className="w-9 h-9 rounded-full object-cover"
          />
          <span className="text-black font-semibold text-xl">Cinder</span>
        </Link>

        <h1
          className="text-black text-3xl md:text-4xl font-medium leading-tight mb-2"
          style={{ letterSpacing: "-0.03em" }}
        >
          Choose a new password.
        </h1>
        <p className="text-black/60 text-base mb-8">
          You&apos;re signed in from your reset link — set a new password to
          finish.
        </p>

        {expired ? (
          <div className="rounded-2xl border border-black/10 p-6">
            <p className="text-black text-base font-medium mb-1">
              This reset link is invalid or has expired.
            </p>
            <p className="text-black/60 text-sm leading-relaxed mb-4">
              Reset links only work once and expire after a while. Request a
              fresh one and try again.
            </p>
            <Link
              href="/forgot-password"
              className="text-black text-sm underline underline-offset-4 hover:text-[#8A3220] transition-colors"
            >
              Send a new reset link
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="new-password"
                className="block text-black/70 text-sm font-medium mb-2"
              >
                New password
              </label>
              <input
                id="new-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-full border border-black/15 bg-white/40 px-5 py-3 text-black placeholder-black/40 outline-none focus:border-black/40 transition-colors duration-300"
              />
            </div>

            {error && (
              <p className="text-[#8A3220] text-sm leading-relaxed">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-3 bg-black text-white text-base font-medium pl-8 pr-2 py-2 rounded-full hover:bg-[#8A3220] transition-colors duration-200 w-fit mt-2 disabled:opacity-60"
            >
              {loading ? "Saving…" : "Set New Password"}
              <span className="bg-white rounded-full p-2">
                <ArrowRight className="w-5 h-5 text-black" />
              </span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
