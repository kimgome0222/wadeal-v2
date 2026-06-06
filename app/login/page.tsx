import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PageShell } from "@/components/page-shell";
import { LoginScreen } from "@/components/login-screen";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { safeRedirectPath } from "@/lib/auth/safe-redirect";

type LoginPageProps = {
  searchParams: Promise<{ next?: string; redirect?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const user = await getServerAuthUser();
  const params = await searchParams;

  if (user) {
    redirect(
      safeRedirectPath(params.next ?? params.redirect ?? "/mypage"),
    );
  }

  return (
    <PageShell>
      <Suspense fallback={null}>
        <LoginScreen variant="buyer" />
      </Suspense>
    </PageShell>
  );
}
