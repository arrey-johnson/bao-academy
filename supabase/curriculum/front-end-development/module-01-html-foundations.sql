-- Module 1: Web Foundations & HTML (Front End Development)
-- Run in Supabase SQL Editor if you prefer SQL over npm run db:seed:frontend

INSERT INTO public.courses (title, slug, description, track, published, sort_order)
VALUES (
  'Front End Development',
  'front-end-development',
  'A structured path from HTML and CSS through JavaScript and React — learn by building real interfaces.',
  'html-css-js',
  TRUE,
  1
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  published = TRUE;

-- Module
INSERT INTO public.modules (id, course_id, title, slug, sort_order)
SELECT
  'b1000001-0001-4000-8000-000000000001',
  c.id,
  'Web Foundations & HTML',
  'html-foundations',
  0
FROM public.courses c
WHERE c.slug = 'front-end-development'
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  sort_order = EXCLUDED.sort_order;

-- Lessons (slides: run npm run db:seed:frontend for full slide content)
