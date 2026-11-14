-- Portfolio schema: profile, content tables, settings, contact submissions, admin users

-- ============ Admin users ============
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY admin_users_self_read ON public.admin_users
  FOR SELECT TO authenticated
  USING (user_id = (SELECT auth.uid()));

-- ============ Helper: is the current user an admin? ============
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = (SELECT auth.uid())
  );
$$;

-- ============ Profile (single row, id = 1) ============
CREATE TABLE IF NOT EXISTS public.profile (
  id              SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  full_name       TEXT NOT NULL DEFAULT '',
  title           TEXT NOT NULL DEFAULT '',
  tagline         TEXT NOT NULL DEFAULT '',
  about           TEXT NOT NULL DEFAULT '',
  photo_url       TEXT,
  photo_key       TEXT,
  resume_url      TEXT,
  resume_key      TEXT,
  email           TEXT NOT NULL DEFAULT '',
  location        TEXT NOT NULL DEFAULT '',
  seo_title       TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY profile_public_read ON public.profile
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY profile_admin_write ON public.profile
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============ Social links ============
CREATE TABLE IF NOT EXISTS public.social_links (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label      TEXT NOT NULL,
  url        TEXT NOT NULL,
  icon       TEXT NOT NULL DEFAULT 'link',
  sort_order INT NOT NULL DEFAULT 0,
  visible    BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY social_public_read ON public.social_links
  FOR SELECT TO anon, authenticated USING (visible = true);

CREATE POLICY social_admin_write ON public.social_links
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============ Education ============
CREATE TABLE IF NOT EXISTS public.education (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  degree      TEXT NOT NULL,
  institution TEXT NOT NULL,
  field       TEXT,
  start_date  TEXT,
  end_date    TEXT,
  description TEXT,
  coursework  TEXT[] NOT NULL DEFAULT '{}',
  sort_order  INT NOT NULL DEFAULT 0,
  visible     BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

CREATE POLICY education_public_read ON public.education
  FOR SELECT TO anon, authenticated USING (visible = true);

CREATE POLICY education_admin_write ON public.education
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============ Skills ============
CREATE TABLE IF NOT EXISTS public.skills (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  description TEXT,
  level       SMALLINT NOT NULL DEFAULT 3 CHECK (level BETWEEN 1 AND 5),
  sort_order  INT NOT NULL DEFAULT 0,
  visible     BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY skills_public_read ON public.skills
  FOR SELECT TO anon, authenticated USING (visible = true);

CREATE POLICY skills_admin_write ON public.skills
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============ Projects ============
CREATE TABLE IF NOT EXISTS public.projects (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title        TEXT NOT NULL,
  description  TEXT,
  problem      TEXT,
  category     TEXT NOT NULL DEFAULT 'Web Development',
  technologies TEXT[] NOT NULL DEFAULT '{}',
  image_url    TEXT,
  image_key    TEXT,
  github_url   TEXT,
  demo_url     TEXT,
  featured     BOOLEAN NOT NULL DEFAULT false,
  sort_order   INT NOT NULL DEFAULT 0,
  visible      BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY projects_public_read ON public.projects
  FOR SELECT TO anon, authenticated USING (visible = true);

CREATE POLICY projects_admin_write ON public.projects
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============ Experience / certifications / achievements ============
CREATE TABLE IF NOT EXISTS public.experience (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind         TEXT NOT NULL DEFAULT 'work' CHECK (kind IN ('internship','work','workshop','certification','achievement')),
  title        TEXT NOT NULL,
  organization TEXT,
  start_date   TEXT,
  end_date     TEXT,
  description  TEXT,
  link_url     TEXT,
  sort_order   INT NOT NULL DEFAULT 0,
  visible      BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY experience_public_read ON public.experience
  FOR SELECT TO anon, authenticated USING (visible = true);

CREATE POLICY experience_admin_write ON public.experience
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============ Site settings (key/value) ============
CREATE TABLE IF NOT EXISTS public.settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY settings_public_read ON public.settings
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY settings_admin_write ON public.settings
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============ Contact form submissions ============
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  message    TEXT NOT NULL,
  read       BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY contact_public_insert ON public.contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 200
    AND length(email) BETWEEN 3 AND 320
    AND length(message) BETWEEN 1 AND 5000
  );

CREATE POLICY contact_admin_read ON public.contact_submissions
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY contact_admin_update ON public.contact_submissions
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============ Grants ============
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.profile, public.social_links, public.education, public.skills,
  public.projects, public.experience, public.settings TO anon, authenticated;
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profile, public.social_links,
  public.education, public.skills, public.projects, public.experience,
  public.settings TO authenticated;
GRANT SELECT, UPDATE ON public.contact_submissions TO authenticated;
GRANT SELECT ON public.admin_users TO authenticated;
