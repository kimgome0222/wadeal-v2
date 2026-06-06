-- Storage buckets: seller-documents, settlement-files (product-images, review-images exist).

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'seller-documents',
  'seller-documents',
  false,
  10485760,
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'settlement-files',
  'settlement-files',
  false,
  10485760,
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS seller_documents_select ON storage.objects;
CREATE POLICY seller_documents_select
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'seller-documents'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.is_admin_user(auth.uid())
    )
  );

DROP POLICY IF EXISTS seller_documents_insert ON storage.objects;
CREATE POLICY seller_documents_insert
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'seller-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS seller_documents_update ON storage.objects;
CREATE POLICY seller_documents_update
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'seller-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'seller-documents'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS seller_documents_delete ON storage.objects;
CREATE POLICY seller_documents_delete
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'seller-documents'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.is_admin_user(auth.uid())
    )
  );

DROP POLICY IF EXISTS settlement_files_select ON storage.objects;
CREATE POLICY settlement_files_select
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'settlement-files'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR public.is_admin_user(auth.uid())
    )
  );

DROP POLICY IF EXISTS settlement_files_admin_insert ON storage.objects;
CREATE POLICY settlement_files_admin_insert
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'settlement-files'
    AND public.is_admin_user(auth.uid())
  );

DROP POLICY IF EXISTS settlement_files_admin_update ON storage.objects;
CREATE POLICY settlement_files_admin_update
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'settlement-files'
    AND public.is_admin_user(auth.uid())
  )
  WITH CHECK (
    bucket_id = 'settlement-files'
    AND public.is_admin_user(auth.uid())
  );

DROP POLICY IF EXISTS settlement_files_admin_delete ON storage.objects;
CREATE POLICY settlement_files_admin_delete
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'settlement-files'
    AND public.is_admin_user(auth.uid())
  );
