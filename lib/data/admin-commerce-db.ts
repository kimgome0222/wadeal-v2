import type {
  AdminBanner,
  AdminCategoryRow,
  AdminEvent,
} from "@/lib/data/admin-commerce-store";
import {
  buildInitialBanners,
  buildInitialEvents,
} from "@/lib/data/admin-commerce-store";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isMissingTableError } from "@/lib/supabase/query-fallback";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/service-role";

function formatLocalDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function mapBannerRow(row: Record<string, unknown>): AdminBanner {
  return {
    id: row.id as string,
    title: row.title as string,
    imageUrl: row.image_url as string,
    linkUrl: row.link_url as string,
    startsAt: formatLocalDateTime(row.starts_at as string),
    endsAt: formatLocalDateTime(row.ends_at as string),
    visible: row.visible as boolean,
    device: row.device as AdminBanner["device"],
    position: row.position as AdminBanner["position"],
  };
}

function mapEventRow(row: Record<string, unknown>): AdminEvent {
  return {
    id: row.id as string,
    title: row.title as string,
    description: row.description as string,
    startsAt: formatLocalDateTime(row.starts_at as string),
    endsAt: formatLocalDateTime(row.ends_at as string),
    status: row.status as AdminEvent["status"],
    heroImageUrl: row.hero_image_url as string,
    linkedCategorySlugs: (row.linked_category_slugs as string[] | null) ?? [],
  };
}

async function getSupabase() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  return createServiceRoleSupabaseClient();
}

export async function dbAdminBannersAvailable(): Promise<boolean> {
  const supabase = await getSupabase();
  if (!supabase) {
    return false;
  }

  const { error } = await supabase.from("admin_banners").select("id").limit(0);
  return !error || !isMissingTableError(error.message);
}

export async function fetchAdminBannersFromDb(): Promise<AdminBanner[] | null> {
  const supabase = await getSupabase();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("admin_banners")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingTableError(error.message)) {
      return null;
    }
    console.error("[admin-commerce-db] banners:", error.message);
    return null;
  }

  return (data ?? []).map((row) => mapBannerRow(row as Record<string, unknown>));
}

export async function insertAdminBannerDb(input: Omit<AdminBanner, "id">): Promise<boolean> {
  const supabase = await getSupabase();
  if (!supabase) {
    return false;
  }

  const { error } = await supabase.from("admin_banners").insert({
    title: input.title,
    image_url: input.imageUrl,
    link_url: input.linkUrl,
    starts_at: input.startsAt.replace(" ", "T"),
    ends_at: input.endsAt.replace(" ", "T"),
    visible: input.visible,
    device: input.device,
    position: input.position,
    sort_order: 0,
  });

  if (error) {
    console.error("[admin-commerce-db] insert banner:", error.message);
    return false;
  }

  return true;
}

export async function deleteAdminBannerDb(bannerId: string): Promise<boolean> {
  const supabase = await getSupabase();
  if (!supabase) {
    return false;
  }

  const { error } = await supabase.from("admin_banners").delete().eq("id", bannerId);
  return !error;
}

export async function updateAdminBannerVisibilityDb(
  bannerId: string,
  visible: boolean,
): Promise<boolean> {
  const supabase = await getSupabase();
  if (!supabase) {
    return false;
  }

  const { error } = await supabase
    .from("admin_banners")
    .update({ visible, updated_at: new Date().toISOString() })
    .eq("id", bannerId);

  return !error;
}

export async function fetchAdminEventsFromDb(): Promise<AdminEvent[] | null> {
  const supabase = await getSupabase();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("admin_events")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    if (isMissingTableError(error.message)) {
      return null;
    }
    console.error("[admin-commerce-db] events:", error.message);
    return null;
  }

  return (data ?? []).map((row) => mapEventRow(row as Record<string, unknown>));
}

export async function insertAdminEventDb(input: Omit<AdminEvent, "id">): Promise<boolean> {
  const supabase = await getSupabase();
  if (!supabase) {
    return false;
  }

  const { error } = await supabase.from("admin_events").insert({
    title: input.title,
    description: input.description,
    starts_at: input.startsAt.replace(" ", "T"),
    ends_at: input.endsAt.replace(" ", "T"),
    status: input.status,
    hero_image_url: input.heroImageUrl,
    linked_category_slugs: input.linkedCategorySlugs,
  });

  return !error;
}

export async function deleteAdminEventDb(eventId: string): Promise<boolean> {
  const supabase = await getSupabase();
  if (!supabase) {
    return false;
  }

  const { error } = await supabase.from("admin_events").delete().eq("id", eventId);
  return !error;
}

export async function fetchCategoryOverridesFromDb(): Promise<Map<string, { visible: boolean; displayOrder: number }> | null> {
  const supabase = await getSupabase();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.from("admin_category_overrides").select("*");

  if (error) {
    if (isMissingTableError(error.message)) {
      return null;
    }
    return null;
  }

  const map = new Map<string, { visible: boolean; displayOrder: number }>();
  for (const row of data ?? []) {
    map.set(row.slug as string, {
      visible: row.visible as boolean,
      displayOrder: row.display_order as number,
    });
  }
  return map;
}

export async function upsertCategoryOverrideDb(input: {
  slug: string;
  visible: boolean;
  displayOrder: number;
}): Promise<boolean> {
  const supabase = await getSupabase();
  if (!supabase) {
    return false;
  }

  const { error } = await supabase.from("admin_category_overrides").upsert(
    {
      slug: input.slug,
      visible: input.visible,
      display_order: input.displayOrder,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "slug" },
  );

  return !error;
}

export async function seedAdminCmsIfEmpty(): Promise<void> {
  const supabase = await getSupabase();
  if (!supabase) {
    return;
  }

  const { count, error } = await supabase
    .from("admin_banners")
    .select("id", { count: "exact", head: true });

  if (error || (count ?? 0) > 0) {
    return;
  }

  const banners = buildInitialBanners();
  await supabase.from("admin_banners").insert(
    banners.map((banner, index) => ({
      title: banner.title,
      image_url: banner.imageUrl,
      link_url: banner.linkUrl,
      starts_at: banner.startsAt.replace(" ", "T"),
      ends_at: banner.endsAt.replace(" ", "T"),
      visible: banner.visible,
      device: banner.device,
      position: banner.position,
      sort_order: index,
    })),
  );

  const events = buildInitialEvents();
  await supabase.from("admin_events").insert(
    events.map((event) => ({
      title: event.title,
      description: event.description,
      starts_at: event.startsAt.replace(" ", "T"),
      ends_at: event.endsAt.replace(" ", "T"),
      status: event.status,
      hero_image_url: event.heroImageUrl,
      linked_category_slugs: event.linkedCategorySlugs,
    })),
  );
}

export async function mergeCategoriesWithOverrides(
  base: AdminCategoryRow[],
  overrides: Map<string, { visible: boolean; displayOrder: number }> | null,
): Promise<AdminCategoryRow[]> {
  if (!overrides || overrides.size === 0) {
    return base;
  }

  return [...base]
    .map((category) => {
      const override = overrides.get(category.slug);
      if (!override) {
        return category;
      }
      return {
        ...category,
        visible: override.visible,
        displayOrder: override.displayOrder,
      };
    })
    .sort((left, right) => left.displayOrder - right.displayOrder);
}
