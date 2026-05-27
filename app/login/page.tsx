import { Suspense } from "react";
import { PageShell } from "@/components/page-shell";
import { LoginScreen } from "@/components/login-screen";

export default function LoginPage() {
  return (
    <PageShell>
      <Suspense fallback={null}>
        <LoginScreen />
      </Suspense>
    </PageShell>
  );
}
