-- BAO Academy LMS — schema + RLS + seed (idempotent)
--
-- FIRST TIME (empty project): run this entire file.
-- TABLES ALREADY EXIST? Use supabase/patch-existing.sql instead (avoids "relation already exists").

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'mentor', 'admin', 'instructor')),
  current_streak INT NOT NULL DEFAULT 0,
  last_activity_date DATE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  track TEXT NOT NULL DEFAULT 'html-css-js',
  published BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE (course_id, slug)
);

CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  estimated_minutes INT NOT NULL DEFAULT 10,
  unlock_rule TEXT NOT NULL DEFAULT 'all_slides' CHECK (unlock_rule IN ('all_slides', 'checkpoint_passed', 'assignment_approved')),
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE (module_id, slug)
);

CREATE TABLE IF NOT EXISTS public.slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  slide_type TEXT NOT NULL DEFAULT 'concept' CHECK (slide_type IN ('concept', 'example', 'challenge', 'quiz', 'checkpoint', 'task')),
  title TEXT,
  content JSONB NOT NULL DEFAULT '{"blocks":[]}'::jsonb,
  UNIQUE (lesson_id, sort_order)
);

CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  last_lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_id)
);

CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_slide_ids UUID[] NOT NULL DEFAULT '{}',
  current_slide_index INT NOT NULL DEFAULT 0,
  bookmark_slide_index INT,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  rubric JSONB DEFAULT '{}'::jsonb,
  due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  github_url TEXT,
  deploy_url TEXT,
  storage_path TEXT,
  screenshot_paths TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'in_review', 'needs_revision', 'approved')),
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  comments TEXT,
  feedback JSONB DEFAULT '{}'::jsonb,
  approved BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'instructor')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_mentor_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('mentor', 'admin', 'instructor')
  );
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_select_admin" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "profiles_update_admin" ON public.profiles FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "courses_select_published" ON public.courses;
DROP POLICY IF EXISTS "courses_all_admin" ON public.courses;
CREATE POLICY "courses_select_published" ON public.courses FOR SELECT
  USING (published = TRUE OR public.is_admin());
CREATE POLICY "courses_all_admin" ON public.courses FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "modules_select" ON public.modules;
DROP POLICY IF EXISTS "modules_all_admin" ON public.modules;
CREATE POLICY "modules_select" ON public.modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_id AND (c.published = TRUE OR public.is_admin())
    )
  );
CREATE POLICY "modules_all_admin" ON public.modules FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "lessons_select" ON public.lessons;
DROP POLICY IF EXISTS "lessons_all_admin" ON public.lessons;
CREATE POLICY "lessons_select" ON public.lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.modules m
      JOIN public.courses c ON c.id = m.course_id
      WHERE m.id = module_id AND (c.published = TRUE OR public.is_admin())
    )
  );
CREATE POLICY "lessons_all_admin" ON public.lessons FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "slides_select" ON public.slides;
DROP POLICY IF EXISTS "slides_all_admin" ON public.slides;
CREATE POLICY "slides_select" ON public.slides FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lessons l
      JOIN public.modules m ON m.id = l.module_id
      JOIN public.courses c ON c.id = m.course_id
      WHERE l.id = lesson_id AND (c.published = TRUE OR public.is_admin())
    )
  );
CREATE POLICY "slides_all_admin" ON public.slides FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "enrollments_select_own" ON public.enrollments;
DROP POLICY IF EXISTS "enrollments_insert_own" ON public.enrollments;
DROP POLICY IF EXISTS "enrollments_update_own" ON public.enrollments;
DROP POLICY IF EXISTS "enrollments_admin" ON public.enrollments;
CREATE POLICY "enrollments_select_own" ON public.enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "enrollments_insert_own" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "enrollments_update_own" ON public.enrollments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "enrollments_admin" ON public.enrollments FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "lesson_progress_own" ON public.lesson_progress;
CREATE POLICY "lesson_progress_own" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "assignments_select" ON public.assignments;
DROP POLICY IF EXISTS "assignments_admin" ON public.assignments;
CREATE POLICY "assignments_select" ON public.assignments FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "assignments_admin" ON public.assignments FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "submissions_select_own" ON public.submissions;
DROP POLICY IF EXISTS "submissions_insert_own" ON public.submissions;
DROP POLICY IF EXISTS "submissions_update_own" ON public.submissions;
DROP POLICY IF EXISTS "submissions_mentor" ON public.submissions;
DROP POLICY IF EXISTS "submissions_mentor_update" ON public.submissions;
CREATE POLICY "submissions_select_own" ON public.submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "submissions_insert_own" ON public.submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "submissions_update_own" ON public.submissions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "submissions_mentor" ON public.submissions FOR SELECT USING (public.is_mentor_or_admin());
CREATE POLICY "submissions_mentor_update" ON public.submissions FOR UPDATE USING (public.is_mentor_or_admin());

DROP POLICY IF EXISTS "reviews_mentor" ON public.reviews;
DROP POLICY IF EXISTS "reviews_student_read" ON public.reviews;
CREATE POLICY "reviews_mentor" ON public.reviews FOR ALL USING (public.is_mentor_or_admin());
CREATE POLICY "reviews_student_read" ON public.reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.submissions s
      WHERE s.id = submission_id AND s.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "announcements_select" ON public.announcements;
DROP POLICY IF EXISTS "announcements_admin" ON public.announcements;
CREATE POLICY "announcements_select" ON public.announcements FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "announcements_admin" ON public.announcements FOR ALL USING (public.is_admin());

CREATE INDEX IF NOT EXISTS idx_modules_course ON public.modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_slides_lesson ON public.slides(lesson_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON public.lesson_progress(user_id);
-- BAO Academy seed: HTML/CSS/JS Track 1 — CSS Flexbox lesson

INSERT INTO public.courses (id, title, slug, description, track, published, sort_order)
VALUES (
  'a0000001-0001-4000-8000-000000000001',
  'HTML, CSS & JavaScript',
  'html-css-js',
  'Learn by building real projects. Start with the fundamentals and ship code from day one.',
  'html-css-js',
  TRUE,
  0
)
ON CONFLICT (slug) DO UPDATE SET published = TRUE;

INSERT INTO public.modules (id, course_id, title, slug, sort_order)
VALUES (
  'a0000002-0001-4000-8000-000000000001',
  'a0000001-0001-4000-8000-000000000001',
  'CSS Layout',
  'css-layout',
  0
)
ON CONFLICT (course_id, slug) DO NOTHING;

INSERT INTO public.lessons (id, module_id, title, slug, description, estimated_minutes, sort_order)
VALUES (
  'a0000003-0001-4000-8000-000000000001',
  'a0000002-0001-4000-8000-000000000001',
  'CSS Flexbox',
  'css-flexbox',
  'Master flex containers and alignment — the foundation of modern layouts.',
  15,
  0
)
ON CONFLICT (module_id, slug) DO NOTHING;

DELETE FROM public.slides WHERE lesson_id = 'a0000003-0001-4000-8000-000000000001';

INSERT INTO public.slides (lesson_id, sort_order, slide_type, title, content) VALUES
(
  'a0000003-0001-4000-8000-000000000001', 0, 'concept', 'What is Flexbox?',
  '{"blocks":[{"type":"heading","text":"What is Flexbox?"},{"type":"text","text":"Flexbox is a CSS layout model that distributes space and aligns items inside a container — along one axis at a time."},{"type":"text","text":"Think of it as telling the browser: arrange these children in a row (or column), and handle spacing for me."}]}'::jsonb
),
(
  'a0000003-0001-4000-8000-000000000001', 1, 'example', 'display: flex',
  '{"blocks":[{"type":"heading","text":"display: flex"},{"type":"text","text":"Turn any block into a flex container with one line:"},{"type":"code","lang":"css","snippet":".container {\n  display: flex;\n}"},{"type":"text","text":"Direct children become flex items, laid out in a row by default."}]}'::jsonb
),
(
  'a0000003-0001-4000-8000-000000000001', 2, 'example', 'justify-content',
  '{"blocks":[{"type":"heading","text":"justify-content"},{"type":"text","text":"Controls alignment along the main axis (horizontal in a row):"},{"type":"code","lang":"css","snippet":".container {\n  display: flex;\n  justify-content: center;\n}"},{"type":"text","text":"Try: flex-start | center | flex-end | space-between | space-around"}]}'::jsonb
),
(
  'a0000003-0001-4000-8000-000000000001', 3, 'example', 'align-items',
  '{"blocks":[{"type":"heading","text":"align-items"},{"type":"text","text":"Controls alignment along the cross axis (vertical in a row):"},{"type":"code","lang":"css","snippet":".container {\n  display: flex;\n  align-items: center;\n}"},{"type":"text","text":"Perfect for vertically centering content without hacks."}]}'::jsonb
),
(
  'a0000003-0001-4000-8000-000000000001', 4, 'challenge', 'Mini challenge',
  '{"blocks":[{"type":"heading","text":"Mini challenge"},{"type":"text","text":"In VS Code, create a div with 3 child boxes. Center them horizontally AND vertically using flexbox."},{"type":"challenge","prompt":"Use display: flex, justify-content: center, and align-items: center on the parent.","hint":"Set a min-height on the parent so vertical centering is visible."}]}'::jsonb
),
(
  'a0000003-0001-4000-8000-000000000001', 5, 'task', 'Project task',
  '{"blocks":[{"type":"heading","text":"Project task"},{"type":"text","text":"Build a responsive navigation bar using flexbox: logo on the left, links on the right. On mobile, stack vertically."},{"type":"text","text":"Open Visual Studio Code, build it locally, then continue to submit when assignments are enabled (Phase 2)."},{"type":"challenge","prompt":"Ship a real component — not just a tutorial copy-paste.","hint":"Use flex-wrap or a media query to handle mobile."}]}'::jsonb
);

INSERT INTO public.announcements (course_id, title, body)
SELECT c.id, 'Welcome to BAO Academy', 'Learn by Building, Not by Watching. Complete your first Flexbox lesson today!'
FROM public.courses c
WHERE c.slug = 'html-css-js'
  AND NOT EXISTS (
    SELECT 1 FROM public.announcements a
    WHERE a.course_id = c.id AND a.title = 'Welcome to BAO Academy'
  );

-- Flexbox project assignment (student dashboard → Assignments)
INSERT INTO public.assignments (id, course_id, lesson_id, title, description, due_at)
SELECT
  'a0000004-0001-4000-8000-000000000001',
  c.id,
  'a0000003-0001-4000-8000-000000000001',
  'Flexbox navigation bar',
  'Build a responsive navigation bar using flexbox: logo on the left, links on the right. On mobile, stack vertically.

Submit your GitHub repo URL and optional live deploy link. A mentor will review your work.',
  NULL
FROM public.courses c
WHERE c.slug = 'html-css-js'
  AND NOT EXISTS (
    SELECT 1 FROM public.assignments a WHERE a.id = 'a0000004-0001-4000-8000-000000000001'
  );

-- Backfill profiles for users created before trigger existed
INSERT INTO public.profiles (id, email, full_name, role)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  COALESCE(u.raw_user_meta_data->>'role', 'student')
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = u.id);

UPDATE public.profiles
SET role = 'admin', updated_at = NOW()
WHERE email = 'arrey.johnson@baotechnologiesandtravels.com';
