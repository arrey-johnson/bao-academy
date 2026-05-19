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
