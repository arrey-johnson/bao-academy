This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

1. Import this repo on [Vercel](https://vercel.com/new).
2. **Environment variables** (Project → Settings → Environment Variables). Required for auth and middleware:

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://zogsfwrcpriugtetdtmd.supabase.co` (your project URL) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API → `anon` `public` |

   Optional: `SUPABASE_SERVICE_ROLE_KEY` (server scripts only; never expose to the client).

3. **Redeploy** after adding variables (Deployments → … → Redeploy).

4. **Supabase Auth** → [URL configuration](https://supabase.com/dashboard/project/zogsfwrcpriugtetdtmd/auth/url-configuration):

   - **Site URL:** `https://bao-academy.vercel.app`
   - **Redirect URLs** (add both):
     - `https://bao-academy.vercel.app/auth/callback`
     - `https://bao-academy.vercel.app/**`

5. Run `supabase/full-setup.sql` in the Supabase SQL Editor if the database is empty.

If you see `MIDDLEWARE_INVOCATION_FAILED`, Supabase env vars are usually missing or wrong on Vercel.
