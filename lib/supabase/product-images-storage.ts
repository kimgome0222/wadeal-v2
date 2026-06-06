export const PRODUCT_IMAGES_BUCKET = "product-images";

export const PRODUCT_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export const PRODUCT_IMAGE_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const PRODUCT_IMAGE_ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;

export type ProductImageValidationError = "invalid_file_type" | "file_too_large";

export function sanitizeProductImagePathSegment(value: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || "draft";
}

export function getProductImageExtension(filename: string, mimeType: string): string | null {
  const lowerName = filename.toLowerCase();
  for (const ext of PRODUCT_IMAGE_ALLOWED_EXTENSIONS) {
    if (lowerName.endsWith(`.${ext}`)) {
      return ext === "jpeg" ? "jpg" : ext;
    }
  }

  if (mimeType === "image/jpeg") {
    return "jpg";
  }

  if (mimeType === "image/png") {
    return "png";
  }

  if (mimeType === "image/webp") {
    return "webp";
  }

  return null;
}

export function validateProductImageFile(file: {
  type: string;
  size: number;
}): ProductImageValidationError | null {
  if (
    !PRODUCT_IMAGE_ALLOWED_MIME_TYPES.includes(
      file.type as (typeof PRODUCT_IMAGE_ALLOWED_MIME_TYPES)[number],
    )
  ) {
    return "invalid_file_type";
  }

  if (file.size > PRODUCT_IMAGE_MAX_BYTES) {
    return "file_too_large";
  }

  return null;
}

export function buildProductImageStoragePath(pathPrefix: string, filename: string, mimeType: string) {
  const prefix = sanitizeProductImagePathSegment(pathPrefix);
  const extension = getProductImageExtension(filename, mimeType);

  if (!extension) {
    return null;
  }

  const baseName = sanitizeProductImagePathSegment(
    filename.replace(/\.[^.]+$/, "") || "image",
  );
  const timestamp = Date.now();

  return `products/${prefix}/${timestamp}-${baseName}.${extension}`;
}

export function getProductImagePublicUrl(supabaseUrl: string, storagePath: string): string {
  const base = supabaseUrl.replace(/\/$/, "");
  const encodedPath = storagePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${base}/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/${encodedPath}`;
}

export function productImageValidationMessage(error: ProductImageValidationError): string {
  if (error === "invalid_file_type") {
    return "jpg, jpeg, png, webp 파일만 업로드할 수 있어요.";
  }

  return "파일 크기는 5MB 이하여야 해요.";
}
