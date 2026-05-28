import { logError } from "@/lib/monitoring/error-log";

export async function logAdminActionFailure(input: {
  message: string;
  error?: unknown;
  action?: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  await logError({
    level: "error",
    source: "admin",
    message: input.message,
    error: input.error,
    metadata: {
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      ...input.metadata,
    },
  });
}
