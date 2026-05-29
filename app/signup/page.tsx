import { redirect } from "next/navigation";

import { PageShell } from "@/components/page-shell";
import { SignupForm } from "@/components/signup-form";
import { getServerAuthUser } from "@/lib/auth/server-session";

export default async function SignupPage() {
  const user = await getServerAuthUser();
  if (user) {
    redirect("/mypage");
  }

  return (
    <PageShell>
      <SignupForm />
    </PageShell>
  );
}
