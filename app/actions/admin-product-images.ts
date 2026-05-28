"use server";

import { isAdminUser } from "@/lib/auth/admin-access";
import { getServerAuthUser } from "@/lib/auth/server-session";
import {
  buildProductImageStoragePath,
  getProductImagePublicUrl,
  PRODUCT_IMAGES_BUCKET,
  validateProductImageFile,
} from "@/lib/supabase/product-images-storage";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type UploadProductImageResult = {
  success: boolean;
  publicUrl?: string;
  error?:
    | "login_required"
    | "forbidden"
    | "storage_unavailable"
    | "invalid_input"
    | "invalid_file_type"
    | "file_too_large"
    | "upload_failed";
};

async function ensureAdmin(): Promise<
  { ok: true } | { ok: false; error: UploadProductImageResult["error"] }
> {
  const user = await getServerAuthUser();
  if (!user) {
    return { ok: false, error: "login_required" };
  }

  if (!(await isAdminUser(user))) {
    return { ok: false, error: "forbidden" };
  }

  return { ok: true };
}

export async function uploadProductImageAction(
  formData: FormData,
): Promise<UploadProductImageResult> {
  const auth = await ensureAdmin();
  if (!auth.ok) {
    return { success: false, error: auth.error };
  }

  if (!isSupabaseConfigured()) {
    return { success: false, error: "storage_unavailable" };
  }

  const file = formData.get("file");
  const pathPrefix = String(formData.get("pathPrefix") ?? "").trim();

  if (!(file instanceof File) || file.size === 0 || !pathPrefix) {
    return { success: false, error: "invalid_input" };
  }

  const validationError = validateProductImageFile(file);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const storagePath = buildProductImageStoragePath(pathPrefix, file.name, file.type);
  if (!storagePath) {
    return { success: false, error: "invalid_file_type" };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, error: "storage_unavailable" };
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("[admin-product-images] upload:", uploadError.message);
    return { success: false, error: "upload_failed" };
  }

  const env = getSupabaseEnv();
  if (!env) {
    return { success: false, error: "storage_unavailable" };
  }

  const { data: publicUrlData } = supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .getPublicUrl(storagePath);

  const publicUrl = publicUrlData.publicUrl || getProductImagePublicUrl(env.url, storagePath);

  return { success: true, publicUrl };
}
