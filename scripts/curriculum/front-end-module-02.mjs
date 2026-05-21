/** Module 2 — Topic 2.1 & 2.2: Introduction to HTML + Document Structure */

export const MODULE_2 = {
  id: "b1000010-0001-4000-8000-000000000001",
  title: "Introduction to HTML & Document Structure",
  slug: "introduction-to-html",
  sort_order: 1,
  lessons: [
    {
      id: "b1000011-0001-4000-8000-000000000001",
      title: "Introduction to HTML",
      slug: "introduction-to-html",
      description:
        "What HTML is, its history, how browsers use it, setting up VS Code, and your first page (Topic 2.1).",
      estimated_minutes: 35,
      sort_order: 0,
      slides: [
        {
          sort_order: 0,
          slide_type: "concept",
          title: "Topic 2.1 overview",
          blocks: [
            { type: "heading", text: "Topic 2.1: Introduction to HTML" },
            {
              type: "text",
              text: "You will learn what HTML is and why it exists, how it relates to CSS and JavaScript, how the language evolved, how browsers turn code into pages, and how to set up VS Code and build your first page.",
            },
          ],
        },
        {
          sort_order: 1,
          slide_type: "concept",
          title: "What is HTML?",
          blocks: [
            { type: "heading", text: "2.1.1 What is HTML?" },
            {
              type: "text",
              text: "HTML (HyperText Markup Language) is the standard markup language for documents on the Web. It uses tags to describe structure and meaning — headings, paragraphs, links, images, forms, and more.",
            },
            {
              type: "text",
              text: "HTML is not a programming language. You are not writing logic loops here — you are annotating content so browsers know what each part is.",
            },
          ],
        },
        {
          sort_order: 2,
          slide_type: "concept",
          title: "Why HTML exists",
          blocks: [
            { type: "heading", text: "Why HTML exists" },
            {
              type: "text",
              text: "The Web needed a common format so any computer could share linked documents. HTML gives every browser the same vocabulary for “this is a title,” “this is a list,” “this links to another page.”",
            },
            {
              type: "text",
              text: "HTML is the skeleton of a website — the bones that hold everything in place before design (CSS) and behaviour (JavaScript) are added.",
            },
          ],
        },
        {
          sort_order: 3,
          slide_type: "example",
          title: "HTML vs CSS vs JavaScript",
          blocks: [
            { type: "heading", text: "HTML vs CSS vs JavaScript" },
            {
              type: "text",
              text: "HTML = structure & content. CSS = presentation (colours, layout, fonts). JavaScript = behaviour (interactions, fetching data, updating the page).",
            },
            {
              type: "code",
              lang: "text",
              snippet:
                "HTML  →  <h1>Welcome</h1>\nCSS   →  h1 { color: purple; }\nJS    →  button.addEventListener('click', ...)",
            },
            {
              type: "text",
              text: "All three work together. Learn HTML first so you have something solid to style and script later.",
            },
          ],
        },
        {
          sort_order: 4,
          slide_type: "concept",
          title: "History of HTML",
          blocks: [
            { type: "heading", text: "2.1.2 History of HTML" },
            {
              type: "text",
              text: "In 1989–1991 Tim Berners-Lee proposed the World Wide Web at CERN. He created HTML, URLs, and HTTP so researchers could share linked documents.",
            },
            {
              type: "text",
              text: "HTML evolved: HTML 2.0, 3.2, 4.01 (tables & layouts), then XHTML (stricter XML rules), and finally HTML5 (2008–2014) with semantic tags, video, audio, and APIs we use today.",
            },
          ],
        },
        {
          sort_order: 5,
          slide_type: "concept",
          title: "How HTML works",
          blocks: [
            { type: "heading", text: "2.1.3 How HTML works" },
            {
              type: "text",
              text: "You write HTML in a text file. The browser downloads that file, parses the tags, and builds an internal tree called the DOM (Document Object Model).",
            },
            {
              type: "text",
              text: "The browser then combines HTML with CSS and JavaScript to paint the page you see. View Source shows the raw HTML; the rendered page is the result after parsing and styling.",
            },
          ],
        },
        {
          sort_order: 6,
          slide_type: "example",
          title: "Source vs rendered",
          blocks: [
            { type: "heading", text: "Source code vs rendered page" },
            {
              type: "code",
              lang: "html",
              snippet: "<p>Hello <strong>BAO</strong> Academy</p>",
            },
            {
              type: "text",
              text: "In source you see tags. On screen you see a paragraph with bold text. Right-click → View Page Source (raw file) vs Inspect (live DOM after scripts run).",
            },
          ],
        },
        {
          sort_order: 7,
          slide_type: "concept",
          title: "VS Code setup",
          blocks: [
            { type: "heading", text: "2.1.4 Setting up a development environment" },
            {
              type: "text",
              text: "Install Visual Studio Code from code.visualstudio.com. It is a free editor built for web development with syntax highlighting, extensions, and a terminal.",
            },
            {
              type: "text",
              text: "Recommended extensions: Live Server (preview with auto-refresh), HTML CSS Support, Prettier (format on save).",
            },
          ],
        },
        {
          sort_order: 8,
          slide_type: "example",
          title: "Project folder & files",
          blocks: [
            { type: "heading", text: "Project folder and file extensions" },
            {
              type: "text",
              text: "Create a folder such as front-end-lab on your Desktop. Inside it, create index.html — the .html extension tells the OS and browser this is an HTML document.",
            },
            {
              type: "code",
              lang: "text",
              snippet:
                "front-end-lab/\n  index.html      ← main page\n  about.html      ← optional second page\n  images/         ← assets folder (later)",
            },
            {
              type: "text",
              text: "File names are lowercase with hyphens (my-page.html). Avoid spaces in file names for fewer broken links on the web.",
            },
          ],
        },
        {
          sort_order: 9,
          slide_type: "example",
          title: "Hello World",
          blocks: [
            { type: "heading", text: "2.1.5 Creating your first web page" },
            {
              type: "text",
              text: "Every developer starts with Hello World. Save this as index.html inside your project folder:",
            },
            {
              type: "code",
              lang: "html",
              snippet:
                "<!DOCTYPE html>\n<html>\n  <head>\n    <title>My First Page</title>\n  </head>\n  <body>\n    <h1>Hello World</h1>\n    <p>I am learning HTML at BAO Academy.</p>\n  </body>\n</html>",
            },
          ],
        },
        {
          sort_order: 10,
          slide_type: "example",
          title: "Open & inspect",
          blocks: [
            { type: "heading", text: "Opening files & inspecting elements" },
            {
              type: "text",
              text: "Open the page: double-click index.html, or use Live Server → Open with Live Server. The page runs in your default browser — no upload required for local practice.",
            },
            {
              type: "text",
              text: "Right-click any text → Inspect (or Inspect Element). The Elements panel shows the live DOM tree built from your HTML. Hover nodes to highlight regions on the page.",
            },
          ],
        },
        {
          sort_order: 11,
          slide_type: "task",
          title: "Practical exercise",
          blocks: [
            { type: "heading", text: "Practical exercise — Topic 2.1" },
            {
              type: "text",
              text: "Build your first HTML page displaying the following information about you:",
            },
            {
              type: "code",
              lang: "html",
              snippet:
                "<!DOCTYPE html>\n<html>\n  <head>\n    <title>About Me</title>\n  </head>\n  <body>\n    <h1>Your Name</h1>\n    <p><strong>Course:</strong> Front End Development</p>\n    <p><strong>Favorite hobby:</strong> Your hobby here</p>\n  </body>\n</html>",
            },
            {
              type: "challenge",
              prompt:
                "Replace placeholders with your real name, course name, and favorite hobby. Open in the browser and use Inspect to find the h1 and both p elements in the DOM.",
              hint: "Use one h1 only. strong makes text bold without CSS.",
            },
          ],
        },
      ],
    },
    {
      id: "b1000012-0001-4000-8000-000000000002",
      title: "HTML Document Structure",
      slug: "html-document-structure",
      description:
        "DOCTYPE, html, head, body, metadata, and how browsers build the document tree (Topic 2.2).",
      estimated_minutes: 25,
      sort_order: 1,
      slides: [
        {
          sort_order: 0,
          slide_type: "concept",
          title: "Topic 2.2 overview",
          blocks: [
            { type: "heading", text: "Topic 2.2: HTML Document Structure" },
            {
              type: "text",
              text: "Every valid HTML page shares the same underlying skeleton. You will learn each required piece — DOCTYPE, html, head, and body — and how the browser turns that structure into a document tree.",
            },
          ],
        },
        {
          sort_order: 1,
          slide_type: "example",
          title: "Anatomy of a document",
          blocks: [
            { type: "heading", text: "2.2.1 Anatomy of an HTML document" },
            {
              type: "code",
              lang: "html",
              snippet:
                "<!DOCTYPE html>   <!-- document type -->\n<html>            <!-- root element -->\n  <head>          <!-- metadata (not visible) -->\n    ...\n  </head>\n  <body>          <!-- visible content -->\n    ...\n  </body>\n</html>",
            },
            {
              type: "text",
              text: "Only content inside body is shown on the page. head holds configuration for the browser and search engines.",
            },
          ],
        },
        {
          sort_order: 2,
          slide_type: "concept",
          title: "DOCTYPE",
          blocks: [
            { type: "heading", text: "DOCTYPE" },
            {
              type: "text",
              text: "<!DOCTYPE html> must be the first line. It tells the browser to use modern HTML5 standards mode instead of older “quirks” compatibility layouts.",
            },
            {
              type: "text",
              text: "Without a correct DOCTYPE, CSS layout can behave unpredictably. Always include it — exactly as shown, no closing tag.",
            },
          ],
        },
        {
          sort_order: 3,
          slide_type: "concept",
          title: "The html element",
          blocks: [
            { type: "heading", text: "2.2.2 The html element" },
            {
              type: "text",
              text: "The <html> element is the root of the document tree. Every other element is a descendant of html.",
            },
            {
              type: "text",
              text: "Add lang=\"en\" (or your language code) on <html> for accessibility and screen readers: <html lang=\"en\">.",
            },
          ],
        },
        {
          sort_order: 4,
          slide_type: "concept",
          title: "The head element",
          blocks: [
            { type: "heading", text: "2.2.3 The head element" },
            {
              type: "text",
              text: "The head contains metadata — information about the page, not the main article users read.",
            },
            {
              type: "code",
              lang: "html",
              snippet:
                "<head>\n  <meta charset=\"UTF-8\" />\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n  <title>Page title in the tab</title>\n</head>",
            },
          ],
        },
        {
          sort_order: 5,
          slide_type: "example",
          title: "head: title, meta, link, script",
          blocks: [
            { type: "heading", text: "title, meta, link, and script in head" },
            {
              type: "text",
              text: "title — text in the browser tab and search results. meta — extra data (charset, viewport, description). link — connects CSS files or icons. script — loads JavaScript (often placed at end of body instead).",
            },
            {
              type: "code",
              lang: "html",
              snippet:
                '<link rel="stylesheet" href="styles.css" />\n<script src="app.js" defer></script>',
            },
          ],
        },
        {
          sort_order: 6,
          slide_type: "concept",
          title: "The body element",
          blocks: [
            { type: "heading", text: "2.2.4 The body element" },
            {
              type: "text",
              text: "Everything visible goes inside body: headings, paragraphs, images, videos, navigation, footers, and forms.",
            },
            {
              type: "text",
              text: "There is only one body per page. Plan your layout as a hierarchy of elements nested inside body.",
            },
          ],
        },
        {
          sort_order: 7,
          slide_type: "concept",
          title: "Document tree",
          blocks: [
            { type: "heading", text: "2.2.5 Browser interpretation of structure" },
            {
              type: "text",
              text: "Browsers parse HTML into a tree: each tag is a node; nested tags are parent/child relationships. This is the DOM.",
            },
            {
              type: "code",
              lang: "text",
              snippet:
                "html\n └── body\n      ├── header\n      │    └── h1\n      └── main\n           └── p",
            },
            {
              type: "text",
              text: "Malformed HTML (unclosed tags, wrong nesting) may still render, but the browser will guess — always write clean, properly nested markup.",
            },
          ],
        },
        {
          sort_order: 8,
          slide_type: "example",
          title: "Complete template",
          blocks: [
            { type: "heading", text: "Complete HTML5 template" },
            {
              type: "code",
              lang: "html",
              snippet:
                '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>Front End Development</title>\n  </head>\n  <body>\n    <header>\n      <h1>BAO Academy</h1>\n    </header>\n    <main>\n      <p>Your visible content here.</p>\n    </main>\n  </body>\n</html>',
            },
          ],
        },
        {
          sort_order: 9,
          slide_type: "challenge",
          title: "Structure check",
          blocks: [
            { type: "heading", text: "Practice — Topic 2.2" },
            {
              type: "challenge",
              prompt:
                "Rebuild your Topic 2.1 page using the full HTML5 template: DOCTYPE, html lang, charset meta, viewport meta, title, and body with h1 + two labeled paragraphs. Validate in Inspect that html → head + body and body contains your content nodes.",
              hint: "Compare View Source (file you wrote) with Elements panel (DOM the browser built).",
            },
          ],
        },
      ],
    },
  ],
};
