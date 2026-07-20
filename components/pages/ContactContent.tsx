"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";

import PageShell from "@/components/PageShell";
import PageHeader from "@/components/PageHeader";
import { revealVariants } from "@/lib/motion";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ContactContent() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isSupabaseConfigured()) {
      const supabase = createClient();
      const { error } = await supabase.from("leads").insert({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      if (error) {
        setError("Something went wrong — please email us directly.");
        setLoading(false);
        return;
      }
    }
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <PageShell>
      <PageHeader
        eyebrow="Get in Touch"
        title="Contact Us"
        description="Tell us about your brand and we'll get back to you within one business day."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={revealVariants}
        >
          {submitted ? (
            <div className="rounded-2xl bg-black p-8 flex flex-col gap-3 max-w-md">
              <span className="w-9 h-9 rounded-full bg-[#FF6E00] flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </span>
              <h3 className="text-white text-xl font-medium">
                Thanks. We&apos;ll be in touch.
              </h3>
              <p className="text-white/60 text-sm">
                A member of the Cinder team will reach out within one
                business day.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 max-w-md"
            >
              <div>
                <label htmlFor="contact-name" className="block text-black/70 text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full rounded-full border border-black/15 bg-white/40 px-5 py-3 text-black placeholder-black/40 outline-none focus:border-black/40 transition-colors duration-300"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="block text-black/70 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@company.com"
                  className="w-full rounded-full border border-black/15 bg-white/40 px-5 py-3 text-black placeholder-black/40 outline-none focus:border-black/40 transition-colors duration-300"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="block text-black/70 text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your brand and goals"
                  className="w-full rounded-2xl border border-black/15 bg-white/40 px-5 py-3 text-black placeholder-black/40 outline-none focus:border-black/40 transition-colors duration-300 resize-none"
                />
              </div>
              {error && (
                <p className="text-[#FF6E00] text-sm leading-relaxed">{error}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-3 bg-black text-white text-base font-medium pl-8 pr-2 py-2 rounded-full hover:bg-[#FF6E00] transition-colors duration-200 w-fit mt-2 disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send Message"}
                <span className="bg-white rounded-full p-2">
                  <ArrowRight className="w-5 h-5 text-black" />
                </span>
              </button>
            </form>
          )}
        </motion.div>

        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={revealVariants}
          className="text-black/70 text-base leading-relaxed"
        >
          <p className="mb-4">
            <span className="block text-black font-medium mb-1">Email</span>
            hello@cinder.ca
          </p>
          <p className="mb-4">
            <span className="block text-black font-medium mb-1">
              Location
            </span>
            Toronto, Canada
          </p>
          <p className="text-black/50 text-sm">
            Placeholder contact details. Replace with real information.
          </p>
        </motion.div>
      </div>
    </PageShell>
  );
}
