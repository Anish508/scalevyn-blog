# 01 — Project Setup

## Overview
Bootstrapped a new Next.js 16 blog platform for Scalevyn using the App Router, TypeScript, Tailwind CSS v4, and Supabase as the backend.

## Files Created
```
scalevyn-blog/
├── .env.local                        ← Supabase keys (fill in)
├── next.config.ts                    ← Image domains, headers, redirects
├── middleware.ts                     ← Auth guard for /admin routes
├── app/
│   ├── layout.tsx                    ← Root layout (Inter + Plus Jakarta Sans)
│   ├── globals.css                   ← Design system: colors, typography, prose
│   ├── page.tsx                      ← Landing → redirects to /blog
│   ├── robots.ts                     ← Search engine rules
│   └── sitemap.ts                    ← Dynamic sitemap with all posts
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 ← Browser Supabase client
│   │   ├── server.ts                 ← Server Supabase client (cookies)
│   │   └── admin.ts                  ← Service role client (storage uploads)
│   ├── queries/posts.ts              ← All DB query helpers
│   └── utils.ts                      ← slug, date, readTime, excerpt helpers
├── types/
│   └── database.ts                   ← TypeScript types for DB schema
└── supabase/
    └── schema.sql                    ← Full PostgreSQL schema + RLS policies
```

## Tech Stack
| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + `@tailwindcss/typography` |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage (blog-images bucket) |
| Markdown | react-markdown + remark-gfm + rehype-highlight |
| Fonts | Inter (body), Plus Jakarta Sans (display) |

## Database Schema
```sql
posts (
  id           UUID PRIMARY KEY,
  title        TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  content      TEXT NOT NULL,
  excerpt      TEXT,
  cover_image  TEXT,
  tags         TEXT[],
  published    BOOLEAN DEFAULT false,
  deleted      BOOLEAN DEFAULT false,    -- soft delete
  created_at   TIMESTAMPTZ,
  updated_at   TIMESTAMPTZ               -- auto-updated via trigger
)
```

## Environment Variables Required
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://blog.scalevyn.com
```

## Setup Steps
1. `cd scalevyn-blog && npm run dev`
2. Create Supabase project at supabase.com
3. Run `supabase/schema.sql` in SQL Editor
4. Create storage bucket `blog-images` (public)
5. Fill `.env.local` with Supabase keys
6. Create admin user: Supabase Dashboard → Auth → Users → Add user

## Pending Tasks
- [ ] Verify `npm run build` passes
- [ ] Set up Vercel deployment with env vars

## Notes
- Tailwind v4 uses `@import "tailwindcss"` (no config file needed)
- `@tailwindcss/typography` added as a `@plugin` directive in globals.css
- Middleware uses `@supabase/ssr` for cookie-based session handling
