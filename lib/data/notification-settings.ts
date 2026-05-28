import type {
  NotificationChannelSettings,
  NotificationSettings,
  UpdateNotificationSettingsInput,
} from "@/lib/profile/types";
import { shouldUseMockData } from "@/lib/env/runtime";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const DEFAULT_CHANNELS: NotificationChannelSettings = {
  kakao: true,
  email: true,
  push: true,
};

const mockSettings = new Map<string, NotificationSettings>();

function logMockFallback(context: string) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[notification-settings] using mock fallback: ${context}`);
  }
}

function parseChannels(value: unknown): NotificationChannelSettings {
  if (!value || typeof value !== "object") {
    return DEFAULT_CHANNELS;
  }

  const channels = value as Record<string, unknown>;
  return {
    kakao: channels.kakao !== false,
    email: channels.email !== false,
    push: channels.push !== false,
  };
}

function mapRow(row: Record<string, unknown>): NotificationSettings {
  return {
    userId: String(row.user_id),
    groupbuyDeadline: Boolean(row.groupbuy_deadline),
    tierAchievement: Boolean(row.tier_achievement),
    orderShipping: Boolean(row.order_shipping),
    marketing: Boolean(row.marketing),
    channels: parseChannels(row.channels),
  };
}

function defaultSettings(userId: string): NotificationSettings {
  return {
    userId,
    groupbuyDeadline: true,
    tierAchievement: true,
    orderShipping: true,
    marketing: false,
    channels: DEFAULT_CHANNELS,
  };
}

export async function getNotificationSettingsForUser(
  userId: string,
): Promise<NotificationSettings> {
  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      logMockFallback("getNotificationSettingsForUser");
      return mockSettings.get(userId) ?? defaultSettings(userId);
    }
    return defaultSettings(userId);
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return defaultSettings(userId);
  }

  const { data, error } = await supabase
    .from("notification_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[data] getNotificationSettingsForUser:", error.message);
    return defaultSettings(userId);
  }

  if (!data) {
    return defaultSettings(userId);
  }

  return mapRow(data as Record<string, unknown>);
}

export async function upsertNotificationSettingsForUser(
  userId: string,
  input: UpdateNotificationSettingsInput,
): Promise<{ success: boolean; settings?: NotificationSettings }> {
  const existing = await getNotificationSettingsForUser(userId);

  const next: NotificationSettings = {
    userId,
    groupbuyDeadline: input.groupbuyDeadline ?? existing.groupbuyDeadline,
    tierAchievement: input.tierAchievement ?? existing.tierAchievement,
    orderShipping: input.orderShipping ?? existing.orderShipping,
    marketing: input.marketing ?? existing.marketing,
    channels: {
      kakao: input.channels?.kakao ?? existing.channels.kakao,
      email: input.channels?.email ?? existing.channels.email,
      push: input.channels?.push ?? existing.channels.push,
    },
  };

  if (!isSupabaseConfigured()) {
    if (shouldUseMockData()) {
      mockSettings.set(userId, next);
      return { success: true, settings: next };
    }
    return { success: true, settings: next };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false };
  }

  const payload = {
    user_id: userId,
    groupbuy_deadline: next.groupbuyDeadline,
    tier_achievement: next.tierAchievement,
    order_shipping: next.orderShipping,
    marketing: next.marketing,
    channels: next.channels,
  };

  const { data, error } = await supabase
    .from("notification_settings")
    .upsert(payload, { onConflict: "user_id" })
    .select("*")
    .single();

  if (error) {
    console.error("[data] upsertNotificationSettingsForUser:", error.message);
    if (shouldUseMockData()) {
      mockSettings.set(userId, next);
      return { success: true, settings: next };
    }
    return { success: false };
  }

  return { success: true, settings: mapRow(data as Record<string, unknown>) };
}
