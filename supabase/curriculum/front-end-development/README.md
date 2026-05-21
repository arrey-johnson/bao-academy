# Front End Development — curriculum build plan

Course slug: **`front-end-development`**  
Student URL: `/learn/front-end-development`

Build order (one module at a time):

| Step | Module | Slug | Status |
|------|--------|------|--------|
| 1 | How the Web Works (etc.) | `html-foundations` | ✅ Module 1 |
| 2 | Introduction to HTML & Document Structure | `introduction-to-html` | ✅ Module 2 — Topics 2.1 & 2.2 |
| 3 | CSS Fundamentals | `css-fundamentals` | Pending |
| 4 | CSS Layout (Flexbox & Grid) | `css-layout` | Pending |
| 5 | Responsive Design | `responsive-design` | Pending |
| 6 | JavaScript Basics | `javascript-basics` | Pending |
| 7 | JavaScript in the Browser | `javascript-browser` | Pending |
| 8 | React Fundamentals | `react-fundamentals` | Pending |
| 9 | Capstone Project | `capstone` | Pending |

### Module 2 lessons

| Lesson | Slug | Topics |
|--------|------|--------|
| Introduction to HTML | `introduction-to-html` | 2.1.1–2.1.5 + practical exercise (12 slides) |
| HTML Document Structure | `html-document-structure` | 2.2.1–2.2.5 (10 slides) |

## Apply Module 1

**Option A — script (recommended)**

```bash
npm run db:seed:frontend
```

**Option B — Supabase SQL Editor**

Paste and run `module-01-html-foundations.sql` in the SQL editor.

## After each module

1. Open **Admin → Courses → Front End Development** and confirm modules/lessons appear.
2. Preview **Learn** as a student: `/learn/front-end-development`.
3. Tell us when you are ready for the next module number.

## Your course in admin

If you created the course manually with a different slug, either:

- Change the slug to `front-end-development` in course settings, or
- Edit `COURSE_SLUG` in `scripts/seed-front-end-development.mjs` before running.
