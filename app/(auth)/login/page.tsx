import type { Metadata } from "next";
import { Suspense } from "react";

import AuthForm from "@/components/pages/AuthForm";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm mode="login" />
    </Suspense>
  );
}
