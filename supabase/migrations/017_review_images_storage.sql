-- Review image storage: public read, owner write under user-scoped paths.
-- Bucket: review-images (max 5MB, jpeg/png/webp)

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-images',
  'review-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE
SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS review_images_public_select ON storage.objects;
CREATE POLICY review_images_public_select
  ON storage.objects FOR SELECT
  USING (bucket_id = 'review-images');

DROP POLICY IF EXISTS review_images_owner_insert ON storage.objects;
CREATE POLICY review_images_owner_insert
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'review-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS review_images_owner_update ON storage.objects;
CREATE POLICY review_images_owner_update
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'review-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'review-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS review_images_owner_delete ON storage.objects;
CREATE POLICY review_images_owner_delete
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'review-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
