"use client";

import { useRouter } from "next/navigation";

import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    if (isSupabaseConfigured()) {
      await createClient().auth.signOut();
    }
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-white/60 text-sm font-medium hover:text-white transition-colors duration-300"
    >
      Sign out
    </button>
  );
}
