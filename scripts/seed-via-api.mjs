/**
 * Seeds curriculum via Supabase REST (service role).
 * Run after schema migration: npm run db:seed
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

async function main() {
  const { error: courseErr } = await supabase.from("courses").upsert(
    {
      id: "a0000001-0001-4000-8000-000000000001",
      title: "HTML, CSS & JavaScript",
      slug: "html-css-js",
      description:
        "Learn by building real projects. Start with the fundamentals and ship code from day one.",
      track: "html-css-js",
      published: true,
      sort_order: 0,
    },
    { onConflict: "slug" }
  );
  if (courseErr) throw courseErr;

  await supabase.from("modules").upsert(
    {
      id: "a0000002-0001-4000-8000-000000000001",
      course_id: "a0000001-0001-4000-8000-000000000001",
      title: "CSS Layout",
      slug: "css-layout",
      sort_order: 0,
    },
    { onConflict: "course_id,slug" }
  );

  await supabase.from("lessons").upsert(
    {
      id: "a0000003-0001-4000-8000-000000000001",
      module_id: "a0000002-0001-4000-8000-000000000001",
      title: "CSS Flexbox",
      slug: "css-flexbox",
      description:
        "Master flex containers and alignment — the foundation of modern layouts.",
      estimated_minutes: 15,
      sort_order: 0,
    },
    { onConflict: "module_id,slug" }
  );

  await supabase
    .from("slides")
    .delete()
    .eq("lesson_id", "a0000003-0001-4000-8000-000000000001");

  const slides = [
    {
      lesson_id: "a0000003-0001-4000-8000-000000000001",
      sort_order: 0,
      slide_type: "concept",
      title: "What is Flexbox?",
      content: {
        blocks: [
          { type: "heading", text: "What is Flexbox?" },
          {
            type: "text",
            text: "Flexbox is a CSS layout model that distributes space and aligns items inside a container — along one axis at a time.",
          },
          {
            type: "text",
            text: "Think of it as telling the browser: arrange these children in a row (or column), and handle spacing for me.",
          },
        ],
      },
    },
    {
      lesson_id: "a0000003-0001-4000-8000-000000000001",
      sort_order: 1,
      slide_type: "example",
      title: "display: flex",
      content: {
        blocks: [
          { type: "heading", text: "display: flex" },
          { type: "text", text: "Turn any block into a flex container with one line:" },
          {
            type: "code",
            lang: "css",
            snippet: ".container {\n  display: flex;\n}",
          },
          {
            type: "text",
            text: "Direct children become flex items, laid out in a row by default.",
          },
        ],
      },
    },
    {
      lesson_id: "a0000003-0001-4000-8000-000000000001",
      sort_order: 2,
      slide_type: "example",
      title: "justify-content",
      content: {
        blocks: [
          { type: "heading", text: "justify-content" },
          {
            type: "text",
            text: "Controls alignment along the main axis (horizontal in a row):",
          },
          {
            type: "code",
            lang: "css",
            snippet: ".container {\n  display: flex;\n  justify-content: center;\n}",
          },
          {
            type: "text",
            text: "Try: flex-start | center | flex-end | space-between | space-around",
          },
        ],
      },
    },
    {
      lesson_id: "a0000003-0001-4000-8000-000000000001",
      sort_order: 3,
      slide_type: "example",
      title: "align-items",
      content: {
        blocks: [
          { type: "heading", text: "align-items" },
          {
            type: "text",
            text: "Controls alignment along the cross axis (vertical in a row):",
          },
          {
            type: "code",
            lang: "css",
            snippet: ".container {\n  display: flex;\n  align-items: center;\n}",
          },
          {
            type: "text",
            text: "Perfect for vertically centering content without hacks.",
          },
        ],
      },
    },
    {
      lesson_id: "a0000003-0001-4000-8000-000000000001",
      sort_order: 4,
      slide_type: "challenge",
      title: "Mini challenge",
      content: {
        blocks: [
          { type: "heading", text: "Mini challenge" },
          {
            type: "text",
            text: "In VS Code, create a div with 3 child boxes. Center them horizontally AND vertically using flexbox.",
          },
          {
            type: "challenge",
            prompt:
              "Use display: flex, justify-content: center, and align-items: center on the parent.",
            hint: "Set a min-height on the parent so vertical centering is visible.",
          },
        ],
      },
    },
    {
      lesson_id: "a0000003-0001-4000-8000-000000000001",
      sort_order: 5,
      slide_type: "task",
      title: "Project task",
      content: {
        blocks: [
          { type: "heading", text: "Project task" },
          {
            type: "text",
            text: "Build a responsive navigation bar using flexbox: logo on the left, links on the right. On mobile, stack vertically.",
          },
          {
            type: "text",
            text: "Open Visual Studio Code, build it locally, then submit when assignments are enabled (Phase 2).",
          },
          {
            type: "challenge",
            prompt: "Ship a real component — not just a tutorial copy-paste.",
            hint: "Use flex-wrap or a media query to handle mobile.",
          },
        ],
      },
    },
  ];

  const { error: slidesErr } = await supabase.from("slides").insert(slides);
  if (slidesErr) throw slidesErr;

  const { data: course } = await supabase
    .from("courses")
    .select("id")
    .eq("slug", "html-css-js")
    .single();

  if (course) {
    const { count } = await supabase
      .from("announcements")
      .select("id", { count: "exact", head: true })
      .eq("course_id", course.id)
      .eq("title", "Welcome to BAO Academy");

    if (!count) {
      await supabase.from("announcements").insert({
        course_id: course.id,
        title: "Welcome to BAO Academy",
        body: "Learn by Building, Not by Watching. Complete your first Flexbox lesson today!",
      });
    }
  }

  console.log("Seed complete.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
