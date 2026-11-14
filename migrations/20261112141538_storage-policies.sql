-- Storage RLS for the public "portfolio" bucket.
-- Public bucket: direct object GETs bypass RLS, so reads are world-readable by design.
-- Writes and metadata listing are restricted to admin users.

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS storage_objects_portfolio_select ON storage.objects;
DROP POLICY IF EXISTS storage_objects_portfolio_insert ON storage.objects;
DROP POLICY IF EXISTS storage_objects_portfolio_update ON storage.objects;
DROP POLICY IF EXISTS storage_objects_portfolio_delete ON storage.objects;

CREATE POLICY storage_objects_portfolio_select ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket = 'portfolio' AND public.is_admin());

CREATE POLICY storage_objects_portfolio_insert ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket = 'portfolio' AND public.is_admin());

CREATE POLICY storage_objects_portfolio_update ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket = 'portfolio' AND public.is_admin())
  WITH CHECK (bucket = 'portfolio' AND public.is_admin());

CREATE POLICY storage_objects_portfolio_delete ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket = 'portfolio' AND public.is_admin());

GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects TO authenticated;
GRANT USAGE ON SCHEMA storage TO authenticated;
