export const REVIEW_IMAGES_BUCKET = "review-images";

export const REVIEW_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export const REVIEW_IMAGE_MAX_COUNT = 5;

export const REVIEW_IMAGE_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const REVIEW_IMAGE_ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;

export type ReviewImageValidationError = "invalid_file_type" | "file_too_large" | "too_many_files";

export function getReviewImageExtension(filename: string, mimeType: string): string | null {
  const lowerName = filename.toLowerCase();
  for (const ext of REVIEW_IMAGE_ALLOWED_EXTENSIONS) {
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

export function validateReviewImageFile(file: {
  type: string;
  size: number;
}): ReviewImageValidationError | null {
  if (
    !REVIEW_IMAGE_ALLOWED_MIME_TYPES.includes(
      file.type as (typeof REVIEW_IMAGE_ALLOWED_MIME_TYPES)[number],
    )
  ) {
    return "invalid_file_type";
  }

  if (file.size > REVIEW_IMAGE_MAX_BYTES) {
    return "file_too_large";
  }

  return null;
}

export function buildReviewImageStoragePath(
  userId: string,
  reviewId: string,
  filename: string,
  mimeType: string,
): string | null {
  const extension = getReviewImageExtension(filename, mimeType);
  if (!extension) {
    return null;
  }

  const timestamp = Date.now();
  const safeName = filename
    .replace(/\.[^.]+$/, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "image";

  return `${userId}/${reviewId}/${timestamp}-${safeName}.${extension}`;
}

export function getReviewImagePublicUrl(supabaseUrl: string, storagePath: string): string {
  const base = supabaseUrl.replace(/\/$/, "");
  const encodedPath = storagePath
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${base}/storage/v1/object/public/${REVIEW_IMAGES_BUCKET}/${encodedPath}`;
}

export function reviewImageValidationMessage(error: ReviewImageValidationError): string {
  if (error === "invalid_file_type") {
    return "jpg, jpeg, png, webp 파일만 업로드할 수 있어요.";
  }

  if (error === "too_many_files") {
    return `리뷰 사진은 최대 ${REVIEW_IMAGE_MAX_COUNT}장까지 등록할 수 있어요.`;
  }

  return "파일 크기는 5MB 이하여야 해요.";
}
