"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!isSupabaseConfigured()) {
      setError(
        "Supabase isn't connected yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.",
      );
      return;
    }

    setLoading(true);
    const supabase = createClient();

    // NOTE: /update-password must be listed in Supabase → Authentication →
    // URL Configuration → Redirect URLs, or the email link won't land here.
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      // Real failures only (e.g. rate limit) — Supabase does not error for
      // unknown emails, so this never leaks account existence.
      setError(error.message);
    } else {
      setMessage(
        "If that email has an account, a reset link is on its way. Check your inbox.",
      );
    }
    setLoading(false);
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
          Reset your password.
        </h1>
        <p className="text-black/60 text-base mb-8">
          Enter your email and we&apos;ll send you a reset link.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="reset-email"
              className="block text-black/70 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              id="reset-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@company.com"
              className="w-full rounded-full border border-black/15 bg-white/40 px-5 py-3 text-black placeholder-black/40 outline-none focus:border-black/40 transition-colors duration-300"
            />
          </div>

          {error && (
            <p className="text-[#8A3220] text-sm leading-relaxed">{error}</p>
          )}
          {message && (
            <p className="text-black/70 text-sm leading-relaxed">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-3 bg-black text-white text-base font-medium pl-8 pr-2 py-2 rounded-full hover:bg-[#8A3220] transition-colors duration-200 w-fit mt-2 disabled:opacity-60"
          >
            {loading ? "One moment…" : "Send Reset Link"}
            <span className="bg-white rounded-full p-2">
              <ArrowRight className="w-5 h-5 text-black" />
            </span>
          </button>
        </form>

        <p className="text-black/60 text-sm mt-8">
          Remembered it?{" "}
          <Link
            href="/login"
            className="text-black underline underline-offset-4 hover:text-[#8A3220] transition-colors"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
