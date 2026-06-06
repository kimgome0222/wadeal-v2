import { isProductionRuntime } from "@/lib/env/runtime";
import type { IdentityProviderKind } from "@/lib/identity/types";
import { mockIdentityProvider } from "@/lib/identity/providers/mock";
import type { IdentityProvider } from "@/lib/identity/providers/types";

const PROVIDERS: IdentityProviderKind[] = ["mock", "nice", "pass", "toss"];

function parseIdentityProviderEnv(): IdentityProviderKind {
  const raw = process.env.IDENTITY_PROVIDER?.trim().toLowerCase();

  if (raw && (PROVIDERS as readonly string[]).includes(raw)) {
    return raw as IdentityProviderKind;
  }

  return "mock";
}

export function getConfiguredIdentityProviderKind(): IdentityProviderKind {
  const kind = parseIdentityProviderEnv();

  if (isProductionRuntime() && kind === "mock") {
    return "nice";
  }

  return kind;
}

export function getIdentityProvider(): IdentityProvider {
  const kind = getConfiguredIdentityProviderKind();

  switch (kind) {
    case "mock":
      return mockIdentityProvider;
    case "nice":
    case "pass":
    case "toss":
      throw new Error(`identity_provider_not_implemented:${kind}`);
    default:
      return mockIdentityProvider;
  }
}

export function isMockIdentityProviderEnabled(): boolean {
  return !isProductionRuntime() && parseIdentityProviderEnv() === "mock";
}
