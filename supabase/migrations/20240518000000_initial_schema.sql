-- BAO Academy LMS — initial schema + RLS

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'mentor', 'admin', 'instructor', 'course_admin')),
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
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  track TEXT NOT NULL DEFAULT 'html-css-js',
  published BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE (course_id, slug)
);

CREATE TABLE public.lessons (
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

CREATE TABLE public.slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  slide_type TEXT NOT NULL DEFAULT 'concept' CHECK (slide_type IN ('concept', 'example', 'challenge', 'quiz', 'checkpoint', 'task')),
  title TEXT,
  content JSONB NOT NULL DEFAULT '{"blocks":[]}'::jsonb,
  UNIQUE (lesson_id, sort_order)
);

CREATE TABLE public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  last_lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, course_id)
);

CREATE TABLE public.lesson_progress (
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

CREATE TABLE public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  rubric JSONB DEFAULT '{}'::jsonb,
  due_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.submissions (
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

CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  mentor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  comments TEXT,
  feedback JSONB DEFAULT '{}'::jsonb,
  approved BOOLEAN,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.announcements (
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

CREATE OR REPLACE FUNCTION public.is_admin_panel()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'instructor', 'course_admin')
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

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_select_admin" ON public.profiles FOR SELECT USING (public.is_admin_panel());
CREATE POLICY "profiles_update_admin" ON public.profiles FOR UPDATE USING (public.is_admin_panel());

CREATE POLICY "courses_select_published" ON public.courses FOR SELECT
  USING (published = TRUE OR public.is_admin());
CREATE POLICY "courses_all_admin" ON public.courses FOR ALL USING (public.is_admin());

CREATE POLICY "modules_select" ON public.modules FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.courses c
      WHERE c.id = course_id AND (c.published = TRUE OR public.is_admin())
    )
  );
CREATE POLICY "modules_all_admin" ON public.modules FOR ALL USING (public.is_admin());

CREATE POLICY "lessons_select" ON public.lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.modules m
      JOIN public.courses c ON c.id = m.course_id
      WHERE m.id = module_id AND (c.published = TRUE OR public.is_admin())
    )
  );
CREATE POLICY "lessons_all_admin" ON public.lessons FOR ALL USING (public.is_admin());

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

CREATE POLICY "enrollments_select_own" ON public.enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "enrollments_insert_own" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "enrollments_update_own" ON public.enrollments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "enrollments_admin" ON public.enrollments FOR ALL USING (public.is_admin_panel());

CREATE POLICY "lesson_progress_own" ON public.lesson_progress FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "assignments_select" ON public.assignments FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "assignments_admin" ON public.assignments FOR ALL USING (public.is_admin());

CREATE POLICY "submissions_select_own" ON public.submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "submissions_insert_own" ON public.submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "submissions_update_own" ON public.submissions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "submissions_mentor" ON public.submissions FOR SELECT USING (public.is_mentor_or_admin());
CREATE POLICY "submissions_mentor_update" ON public.submissions FOR UPDATE USING (public.is_mentor_or_admin());

CREATE POLICY "reviews_mentor" ON public.reviews FOR ALL USING (public.is_mentor_or_admin());
CREATE POLICY "reviews_student_read" ON public.reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.submissions s
      WHERE s.id = submission_id AND s.user_id = auth.uid()
    )
  );

CREATE POLICY "announcements_select" ON public.announcements FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "announcements_admin" ON public.announcements FOR ALL USING (public.is_admin());

CREATE INDEX idx_modules_course ON public.modules(course_id);
CREATE INDEX idx_lessons_module ON public.lessons(module_id);
CREATE INDEX idx_slides_lesson ON public.slides(lesson_id);
CREATE INDEX idx_enrollments_user ON public.enrollments(user_id);
CREATE INDEX idx_lesson_progress_user ON public.lesson_progress(user_id);
