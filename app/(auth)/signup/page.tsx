import type { Metadata } from "next";
import { Suspense } from "react";

import AuthForm from "@/components/pages/AuthForm";

export const metadata: Metadata = {
  title: "Create Account",
  robots: { index: false },
};

export default function SignupPage() {
  return (
    <Suspense>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
