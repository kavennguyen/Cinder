import type { Metadata } from "next";

import UpdatePasswordForm from "@/components/pages/UpdatePasswordForm";

export const metadata: Metadata = {
  title: "New Password",
  robots: { index: false },
};

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />;
}
