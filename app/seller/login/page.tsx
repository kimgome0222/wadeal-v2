import { redirect } from "next/navigation";
import { Suspense } from "react";

import { LoginScreen } from "@/components/login-screen";
import { PageShell } from "@/components/page-shell";
import { getServerAuthUser } from "@/lib/auth/server-session";
import { safeRedirectPath } from "@/lib/auth/safe-redirect";

type SellerLoginPageProps = {
  searchParams: Promise<{ next?: string; redirect?: string }>;
};

export default async function SellerLoginPage({
  searchParams,
}: SellerLoginPageProps) {
  const user = await getServerAuthUser();
  const params = await searchParams;

  if (user) {
    redirect(
      safeRedirectPath(
        params.next ?? params.redirect ?? "/seller/dashboard",
      ),
    );
  }

  return (
    <PageShell>
      <Suspense fallback={null}>
        <LoginScreen variant="seller" />
      </Suspense>
    </PageShell>
  );
}
