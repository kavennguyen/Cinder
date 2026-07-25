import type { Metadata } from "next";

import ForgotPasswordForm from "@/components/pages/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
