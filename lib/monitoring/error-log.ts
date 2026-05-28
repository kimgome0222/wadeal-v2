import type { Json } from "@/lib/database/types";
import { captureException } from "@/lib/monitoring/sentry";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

import {
  ERROR_LEVELS,
  ERROR_SOURCES,
  getErrorLevelLabel,
  getErrorSourceLabel,
  type ErrorLevel,
  type ErrorSource,
} from "@/lib/monitoring/error-log-shared";

const SENSITIVE_KEY_PATTERN =
  /^(billing_key|secret|ci_hash|di_hash|password|token|access_token|refresh_token|payment_key|raw_response|api_key|private_key|client_secret|phone|address|recipient_name|shipping_phone|shipping_address|orderer_name|orderer_phone|real_name|email|nickname)$/i;

const SENSITIVE_SUBSTRING_PATTERN =
  /(billing_key|secret|ci_hash|di_hash|password|token|payment_key|raw_response|api_key|private_key|client_secret|phone|address_line|recipient_name|orderer_name|orderer_phone|real_name)/i;

const PII_VALUE_PATTERNS = [
  /^010\d{8}$/,
  /^\+82/,
  /^\d{2,3}-\d{3,4}-\d{4}$/,
];

function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY_PATTERN.test(key) || SENSITIVE_SUBSTRING_PATTERN.test(key);
}

function redactStringValue(value: string): string {
  const trimmed = value.trim();
  if (PII_VALUE_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return "[redacted]";
  }

  if (trimmed.length > 120 && /\s/.test(trimmed)) {
    return "[redacted_text]";
  }

  return value;
}

export function sanitizeMetadata(data: unknown): Json | null {
  if (data === null || data === undefined) {
    return null;
  }

  if (typeof data === "string") {
    return redactStringValue(data) as Json;
  }

  if (typeof data !== "object") {
    return data as Json;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeMetadata(item)) as Json;
  }

  const result: Record<string, Json | undefined> = {};

  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    if (isSensitiveKey(key)) {
      continue;
    }

    if (typeof value === "string") {
      result[key] = redactStringValue(value) as Json;
      continue;
    }

    if (value !== null && typeof value === "object") {
      result[key] = sanitizeMetadata(value) ?? null;
      continue;
    }

    result[key] = value as Json;
  }

  return result;
}

function stackFromError(error: unknown): string | null {
  if (error instanceof Error && error.stack) {
    return error.stack.slice(0, 8000);
  }

  return null;
}

export type LogErrorInput = {
  level: ErrorLevel;
  source: ErrorSource;
  message: string;
  error?: unknown;
  userId?: string | null;
  orderId?: string | null;
  paymentId?: string | null;
  dealId?: string | null;
  productId?: string | null;
  metadata?: Record<string, unknown> | null;
};

export async function logError(input: LogErrorInput): Promise<{ success: boolean; id?: string }> {
  const stack = stackFromError(input.error);
  const metadata = sanitizeMetadata({
    ...(input.metadata ?? {}),
    ...(input.error && !(input.error instanceof Error)
      ? { errorDetail: String(input.error).slice(0, 500) }
      : {}),
    ...(input.error instanceof Error && input.error.message !== input.message
      ? { errorMessage: input.error.message }
      : {}),
  });

  if (input.level === "error" || input.level === "critical") {
    void captureException(input.error ?? new Error(input.message), {
      level: input.level === "critical" ? "error" : "error",
      tags: {
        source: input.source,
        level: input.level,
      },
      extra: {
        message: input.message,
        orderId: input.orderId ?? undefined,
        paymentId: input.paymentId ?? undefined,
        dealId: input.dealId ?? undefined,
        productId: input.productId ?? undefined,
      },
    });
  }

  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    if (process.env.NODE_ENV === "development") {
      console.error(`[error-log] ${input.level}/${input.source}:`, input.message, metadata);
    }
    return { success: false };
  }

  const { data, error } = await supabase
    .from("error_logs")
    .insert({
      level: input.level,
      source: input.source,
      message: input.message.slice(0, 2000),
      stack,
      user_id: input.userId ?? null,
      order_id: input.orderId ?? null,
      payment_id: input.paymentId ?? null,
      deal_id: input.dealId ?? null,
      product_id: input.productId ?? null,
      metadata,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[error-log] insert failed:", error.message);
    return { success: false };
  }

  return { success: true, id: (data as { id: string }).id };
}

export async function resolveErrorLog(
  logId: string,
  _adminUserId: string,
): Promise<{ success: boolean; error?: "not_found" | "save_failed" }> {
  const supabase = createServiceRoleSupabaseClient();
  if (!supabase) {
    return { success: false, error: "save_failed" };
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("error_logs")
    .update({ resolved_at: now })
    .eq("id", logId)
    .is("resolved_at", null)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[error-log] resolve failed:", error.message);
    return { success: false, error: "save_failed" };
  }

  if (!data) {
    return { success: false, error: "not_found" };
  }

  return { success: true };
}

export {
  ERROR_LEVELS,
  ERROR_SOURCES,
  getErrorLevelLabel,
  getErrorSourceLabel,
  type ErrorLevel,
  type ErrorSource,
} from "@/lib/monitoring/error-log-shared";
