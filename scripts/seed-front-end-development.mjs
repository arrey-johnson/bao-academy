/**
 * Seeds Front End Development curriculum modules.
 * Run: npm run db:seed:frontend
 */
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { MODULE_2 } from "./curriculum/front-end-module-02.mjs";

dotenv.config({ path: ".env.local" });

const COURSE_SLUG = "front-end-development";
const COURSE_TITLE = "Front End Development";

const MODULE_1 = {
  id: "b1000001-0001-4000-8000-000000000001",
  title: "Web Foundations & HTML",
  slug: "html-foundations",
  sort_order: 0,
};

const MODULE_1_LESSONS = [
  {
    id: "b1000002-0001-4000-8000-000000000001",
    title: "How the Web Works",
    slug: "how-the-web-works",
    description:
      "Internet vs Web, browsers, servers, DNS, HTTP/HTTPS, the request-response cycle, and how browsers render pages.",
    estimated_minutes: 28,
    sort_order: 0,
    slides: [
      {
        sort_order: 0,
        slide_type: "concept",
        title: "Learning goals",
        blocks: [
          { type: "heading", text: "How the Web Works" },
          {
            type: "text",
            text: "By the end of this lesson you will be able to explain what the Internet is, how it differs from the World Wide Web, and what happens from typing a URL to seeing a page on screen.",
          },
          {
            type: "text",
            text: "You will understand browsers, servers, domain names, DNS, HTTP/HTTPS, the request-response cycle, page rendering, and the main components involved when visiting a website.",
          },
        ],
      },
      {
        sort_order: 1,
        slide_type: "concept",
        title: "What is the Internet?",
        blocks: [
          { type: "heading", text: "What is the Internet?" },
          {
            type: "text",
            text: "The Internet is a global network of connected computers and devices that communicate using agreed rules (protocols). It is the infrastructure — cables, routers, data centres, and wireless links that move data between machines.",
          },
          {
            type: "text",
            text: "The Internet existed before the Web. Email, file transfer, and video calls all run on the Internet. The Web is one popular service that uses it.",
          },
        ],
      },
      {
        sort_order: 2,
        slide_type: "concept",
        title: "Internet vs World Wide Web",
        blocks: [
          { type: "heading", text: "Internet vs World Wide Web" },
          {
            type: "text",
            text: "The World Wide Web (WWW or “the Web”) is a system of linked documents and resources accessed through browsers. Web pages are identified by URLs and linked with hyperlinks.",
          },
          {
            type: "text",
            text: "Internet = the network. Web = websites, pages, and apps delivered over that network using HTTP. When people say “browse the web,” they mean using a browser to open pages — not the entire Internet.",
          },
        ],
      },
      {
        sort_order: 3,
        slide_type: "concept",
        title: "Browsers and servers",
        blocks: [
          { type: "heading", text: "Web browsers and web servers" },
          {
            type: "text",
            text: "A web browser (Chrome, Firefox, Safari, Edge) is client software on your device. It requests resources, interprets HTML/CSS/JavaScript, and displays the page to you.",
          },
          {
            type: "text",
            text: "A web server is software (often on a remote computer) that listens for requests, finds or generates files, and sends responses back. Your browser asks; the server answers.",
          },
        ],
      },
      {
        sort_order: 4,
        slide_type: "concept",
        title: "Domain names",
        blocks: [
          { type: "heading", text: "Domain names" },
          {
            type: "text",
            text: "Computers find each other using IP addresses (e.g. 93.184.216.34). Domain names are human-friendly labels — like learn.baotechnologies.com — that point to those addresses.",
          },
          {
            type: "text",
            text: "A domain has parts: subdomain (learn), domain (baotechnologies), top-level domain (.com). You register domains so users can reach your site without memorising numbers.",
          },
        ],
      },
      {
        sort_order: 5,
        slide_type: "example",
        title: "How DNS works",
        blocks: [
          { type: "heading", text: "How DNS works" },
          {
            type: "text",
            text: "DNS (Domain Name System) is the phone book of the Internet. When you enter a URL, your browser asks DNS: “What IP address owns this domain?”",
          },
          {
            type: "code",
            lang: "text",
            snippet:
              "1. You type: learn.baotechnologies.com\n2. Browser asks DNS resolver\n3. Resolver returns IP address\n4. Browser connects to that server",
          },
          {
            type: "text",
            text: "DNS answers are cached for speed. If DNS fails, the browser cannot reach the site even if the server is running.",
          },
        ],
      },
      {
        sort_order: 6,
        slide_type: "concept",
        title: "Request-response cycle",
        blocks: [
          { type: "heading", text: "The request-response cycle" },
          {
            type: "text",
            text: "Every page load is a cycle: (1) You enter a URL or click a link. (2) Browser resolves DNS. (3) Browser opens a connection and sends an HTTP request. (4) Server processes the request. (5) Server sends an HTTP response. (6) Browser receives and processes the response.",
          },
          {
            type: "text",
            text: "One HTML page often triggers more requests — for CSS, JavaScript, images, and fonts. Each follows the same request-response pattern.",
          },
        ],
      },
      {
        sort_order: 7,
        slide_type: "example",
        title: "HTTP and HTTPS",
        blocks: [
          { type: "heading", text: "HTTP and HTTPS" },
          {
            type: "text",
            text: "HTTP (HyperText Transfer Protocol) defines how requests and responses are formatted: method (GET, POST), headers, status codes, and body.",
          },
          {
            type: "code",
            lang: "text",
            snippet:
              "GET /learn/front-end-development HTTP/1.1\nHost: learn.baotechnologies.com\n\n→ 200 OK\n→ HTML document in response body",
          },
          {
            type: "text",
            text: "HTTPS is HTTP plus TLS encryption. It protects passwords and data in transit. Modern sites use HTTPS by default (lock icon in the browser).",
          },
        ],
      },
      {
        sort_order: 8,
        slide_type: "concept",
        title: "Rendering a web page",
        blocks: [
          { type: "heading", text: "How a web page is rendered" },
          {
            type: "text",
            text: "1. Parse HTML → build the DOM (Document Object Model) tree. 2. Fetch and parse CSS → build the CSSOM. 3. Combine into a render tree. 4. Layout: calculate size and position of elements. 5. Paint: draw pixels. 6. JavaScript may change the DOM and trigger reflow/repaint.",
          },
          {
            type: "text",
            text: "You see the final painted result. Slow CSS or heavy JavaScript can delay rendering — that is why front-end performance matters.",
          },
        ],
      },
      {
        sort_order: 9,
        slide_type: "concept",
        title: "Components of a visit",
        blocks: [
          { type: "heading", text: "Main components when visiting a website" },
          {
            type: "text",
            text: "User → Device & browser → Internet connection → DNS resolver → Web server → Application/backend (optional) → Database (optional) → Response files (HTML, CSS, JS, assets) → Browser rendering engine → Screen.",
          },
          {
            type: "text",
            text: "As a front-end developer you mainly control HTML structure, CSS presentation, client-side JavaScript, and how assets are requested — within this pipeline.",
          },
        ],
      },
      {
        sort_order: 10,
        slide_type: "challenge",
        title: "Apply what you learned",
        blocks: [
          { type: "heading", text: "Apply what you learned" },
          {
            type: "challenge",
            prompt:
              "Open DevTools → Network, reload this page, and label: (1) one DNS-related step you cannot see but happened, (2) the first document request and its status code, (3) two additional resource types loaded (e.g. stylesheet, script). Write one sentence each for browser role and server role.",
            hint: "Filter by Doc, CSS, and JS in the Network tab. Status 200 means the request succeeded.",
          },
        ],
      },
    ],
  },
  {
    id: "b1000003-0001-4000-8000-000000000002",
    title: "HTML Structure & Semantics",
    slug: "html-structure-semantics",
    description:
      "Write valid HTML with semantic tags so pages are accessible and SEO-friendly.",
    estimated_minutes: 20,
    sort_order: 1,
    slides: [
      {
        sort_order: 0,
        slide_type: "concept",
        title: "HTML documents",
        blocks: [
          { type: "heading", text: "What is HTML?" },
          {
            type: "text",
            text: "HTML (HyperText Markup Language) describes structure and meaning — not visual design. Browsers turn your tags into the DOM tree.",
          },
          {
            type: "text",
            text: "Good HTML is semantic: use the tag that best describes the content (not just <div> for everything).",
          },
        ],
      },
      {
        sort_order: 1,
        slide_type: "example",
        title: "Boilerplate",
        blocks: [
          { type: "heading", text: "Every HTML file starts like this" },
          {
            type: "code",
            lang: "html",
            snippet:
              '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>My page</title>\n  </head>\n  <body>\n    <!-- content here -->\n  </body>\n</html>',
          },
        ],
      },
      {
        sort_order: 2,
        slide_type: "example",
        title: "Semantic layout",
        blocks: [
          { type: "heading", text: "Semantic layout tags" },
          {
            type: "code",
            lang: "html",
            snippet:
              "<header>\n  <nav>…links…</nav>\n</header>\n<main>\n  <article>\n    <h1>Page title</h1>\n    <p>Intro paragraph.</p>\n  </article>\n</main>\n<footer>© BAO Academy</footer>",
          },
          {
            type: "text",
            text: "header, nav, main, article, section, aside, footer help screen readers and search engines understand your page.",
          },
        ],
      },
      {
        sort_order: 3,
        slide_type: "example",
        title: "Headings & lists",
        blocks: [
          { type: "heading", text: "Headings and lists" },
          {
            type: "code",
            lang: "html",
            snippet:
              "<h1>One main title per page</h1>\n<h2>Section</h2>\n<ul>\n  <li>Unordered item</li>\n</ul>\n<ol>\n  <li>Step one</li>\n  <li>Step two</li>\n</ol>",
          },
        ],
      },
      {
        sort_order: 4,
        slide_type: "challenge",
        title: "Outline a page",
        blocks: [
          { type: "heading", text: "Mini challenge" },
          {
            type: "challenge",
            prompt:
              "In VS Code, create index.html with header (site name), main (h1 + two sections with h2), and footer. Use only semantic tags — no CSS yet.",
            hint: "Validate structure: one h1, logical heading order h1 → h2 → h3.",
          },
        ],
      },
    ],
  },
  {
    id: "b1000004-0001-4000-8000-000000000003",
    title: "Forms, Links & Media",
    slug: "forms-links-media",
    description:
      "Connect pages with links, embed images, and build accessible forms.",
    estimated_minutes: 18,
    sort_order: 2,
    slides: [
      {
        sort_order: 0,
        slide_type: "example",
        title: "Links",
        blocks: [
          { type: "heading", text: "Links" },
          {
            type: "code",
            lang: "html",
            snippet:
              '<a href="https://developer.mozilla.org/">MDN docs</a>\n<a href="/about.html">About us</a>\n<a href="#contact">Jump to contact section</a>',
          },
          {
            type: "text",
            text: "Use meaningful link text (not “click here”). External links often open in a new tab with rel=\"noopener\".",
          },
        ],
      },
      {
        sort_order: 1,
        slide_type: "example",
        title: "Images",
        blocks: [
          { type: "heading", text: "Images" },
          {
            type: "code",
            lang: "html",
            snippet:
              '<img src="photo.jpg" alt="Student coding on a laptop" width="400" height="300" />',
          },
          {
            type: "text",
            text: "alt is required for accessibility — describe the image, not “image1”. Always include width/height or CSS to avoid layout shift.",
          },
        ],
      },
      {
        sort_order: 2,
        slide_type: "example",
        title: "Forms",
        blocks: [
          { type: "heading", text: "Forms" },
          {
            type: "code",
            lang: "html",
            snippet:
              '<form action="/subscribe" method="post">\n  <label for="email">Email</label>\n  <input id="email" name="email" type="email" required />\n  <button type="submit">Subscribe</button>\n</form>',
          },
          {
            type: "text",
            text: "Every input needs a label (for/id). Use the right type: email, tel, password, number. required and placeholder help users.",
          },
        ],
      },
      {
        sort_order: 3,
        slide_type: "challenge",
        title: "Contact block",
        blocks: [
          { type: "heading", text: "Mini challenge" },
          {
            type: "challenge",
            prompt:
              "Add a contact section with a form: name, email, message (textarea), and submit button. Link to it from the header nav.",
            hint: "Use <section id=\"contact\"> so your #contact anchor works.",
          },
        ],
      },
      {
        sort_order: 4,
        slide_type: "task",
        title: "Module 1 project",
        blocks: [
          { type: "heading", text: "Module 1 project" },
          {
            type: "text",
            text: "Build a single-page personal or portfolio site in pure HTML: hero, about, projects list, contact form. No CSS required yet — focus on structure.",
          },
          {
            type: "challenge",
            prompt:
              "Ship index.html with semantic tags, working internal links, at least one image with alt text, and a form with labels.",
            hint: "Open the file in the browser (Live Server or drag into Chrome) and click through every link.",
          },
        ],
      },
    ],
  },
];

const MODULES = [
  { ...MODULE_1, lessons: MODULE_1_LESSONS },
  MODULE_2,
];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

async function resolveCourseId() {
  const { data: bySlug } = await supabase
    .from("courses")
    .select("id, slug, title")
    .eq("slug", COURSE_SLUG)
    .maybeSingle();

  if (bySlug) return bySlug.id;

  const { data: byTitle } = await supabase
    .from("courses")
    .select("id, slug, title")
    .ilike("title", COURSE_TITLE)
    .limit(1)
    .maybeSingle();

  if (byTitle) {
    console.log(`Using existing course "${byTitle.title}" (slug: ${byTitle.slug})`);
    return byTitle.id;
  }

  const { data: created, error } = await supabase
    .from("courses")
    .insert({
      title: COURSE_TITLE,
      slug: COURSE_SLUG,
      description:
        "A structured path from HTML and CSS through JavaScript and React — learn by building real interfaces.",
      track: "html-css-js",
      published: true,
      sort_order: 1,
    })
    .select("id")
    .single();

  if (error) throw error;
  console.log("Created course:", COURSE_TITLE);
  return created.id;
}

async function main() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
  }

  const courseId = await resolveCourseId();
  console.log("Course ID:", courseId);

  for (const module of MODULES) {
    const { lessons, ...moduleRow } = module;
    const { error: modErr } = await supabase.from("modules").upsert(
      {
        ...moduleRow,
        course_id: courseId,
      },
      { onConflict: "id" }
    );
    if (modErr) throw modErr;
    console.log(`\nModule: ${module.title}`);

    for (const lesson of lessons) {
      const { slides, ...lessonRow } = lesson;
      const { error: lessonErr } = await supabase.from("lessons").upsert(
        {
          ...lessonRow,
          module_id: module.id,
        },
        { onConflict: "id" }
      );
      if (lessonErr) throw lessonErr;

      await supabase.from("slides").delete().eq("lesson_id", lesson.id);

      const slideRows = slides.map((s) => ({
        lesson_id: lesson.id,
        sort_order: s.sort_order,
        slide_type: s.slide_type,
        title: s.title,
        content: { blocks: s.blocks },
      }));

      const { error: slideErr } = await supabase.from("slides").insert(slideRows);
      if (slideErr) throw slideErr;

      console.log(`  Lesson: ${lesson.title} (${slides.length} slides)`);
    }
  }

  console.log("\nDone. Preview: /learn/" + COURSE_SLUG);
  console.log("Admin: /admin/courses (open Front End Development)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
