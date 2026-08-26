"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

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
      className="group inline-flex items-center gap-2.5 rounded-full px-3.5 py-2.5 font-ui text-on-rail-dim text-sm font-medium hover:text-on-rail hover:bg-white/5 transition-colors duration-200 focus-ring-rail w-full"
    >
      <LogOut
        className="w-4 h-4 shrink-0 group-hover:text-flame transition-colors duration-200"
        aria-hidden="true"
      />
      Sign out
    </button>
  );
}
