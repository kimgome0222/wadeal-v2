type SentryContext = {
  level?: "error" | "warning" | "info";
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
};

type SentryScope = {
  setLevel: (level: SentryContext["level"]) => void;
  setTag: (key: string, value: string) => void;
  setExtras: (extra: Record<string, unknown>) => void;
};

let initAttempted = false;
let sentryEnabled = false;

function getSentryDsn(): string | null {
  const dsn = process.env.SENTRY_DSN?.trim();
  return dsn || null;
}

/**
 * Initialize Sentry when SENTRY_DSN is set and @sentry/nextjs is installed.
 * Safe to call multiple times; no-op without DSN or SDK.
 */
export async function initSentry(): Promise<void> {
  if (initAttempted) {
    return;
  }

  initAttempted = true;

  const dsn = getSentryDsn();
  if (!dsn) {
    return;
  }

  try {
    const sentryModule = "@sentry" + "/nextjs";
    const Sentry = await import(/* webpackIgnore: true */ sentryModule);
    Sentry.init({
      dsn,
      enabled: process.env.NODE_ENV === "production" || process.env.SENTRY_DEBUG === "true",
      tracesSampleRate: 0,
      environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
    });
    sentryEnabled = true;
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.info(
        "[sentry] SENTRY_DSN is set but @sentry/nextjs is not installed. Install the SDK to enable external reporting.",
      );
    }
  }
}

export async function captureException(
  error: unknown,
  context?: SentryContext,
): Promise<void> {
  const dsn = getSentryDsn();
  if (!dsn) {
    return;
  }

  if (!initAttempted) {
    await initSentry();
  }

  if (!sentryEnabled) {
    return;
  }

  try {
    const sentryModule = "@sentry" + "/nextjs";
    const Sentry = await import(/* webpackIgnore: true */ sentryModule);
    Sentry.withScope((scope: SentryScope) => {
      if (context?.level) {
        scope.setLevel(context.level);
      }

      if (context?.tags) {
        for (const [key, value] of Object.entries(context.tags)) {
          scope.setTag(key, value);
        }
      }

      if (context?.extra) {
        scope.setExtras(context.extra);
      }

      if (error instanceof Error) {
        Sentry.captureException(error);
        return;
      }

      Sentry.captureMessage(typeof error === "string" ? error : "Unknown error", "error");
    });
  } catch {
    // SDK unavailable at runtime
  }
}
