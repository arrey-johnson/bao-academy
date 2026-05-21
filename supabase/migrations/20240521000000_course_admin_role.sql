-- Course admin: limited admin for students + enrollments only (super admin = admin/instructor)

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('student', 'mentor', 'admin', 'instructor', 'course_admin'));

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

DROP POLICY IF EXISTS "profiles_select_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;
CREATE POLICY "profiles_select_admin" ON public.profiles
  FOR SELECT USING (public.is_admin_panel());
CREATE POLICY "profiles_update_admin" ON public.profiles
  FOR UPDATE USING (public.is_admin_panel());

DROP POLICY IF EXISTS "enrollments_admin" ON public.enrollments;
CREATE POLICY "enrollments_admin" ON public.enrollments
  FOR ALL USING (public.is_admin_panel());
