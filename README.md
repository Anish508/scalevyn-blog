# Scalevyn Blog

A modern, high-performance, SEO-optimized blog platform built with **Next.js 16 (App Router)** and **Supabase**.

![Stack](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase) ![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

---

## ✨ Features

| Feature | Details |
|---|---|
| **Blog Listing** | Paginated, tag-filtered, featured post |
| **Blog Detail** | Markdown rendering, YouTube embeds, related posts |
| **Admin Dashboard** | CRUD with publish/draft toggle |
| **Rich Editor** | Markdown toolbar, inline image upload, tag manager |
| **Auth** | Supabase email/password (protected `/admin`) |
| **Image Upload** | Supabase Storage (covers + inline content) |
| **SEO** | JSON-LD, OG tags, sitemap.xml, robots.txt, canonical URLs |
| **Performance** | ISR (60s), SSG, Next.js Image optimization, loading skeletons |
| **Soft Delete** | Posts flagged `deleted=true`, recoverable from DB |

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor → New Query** and run the full schema:

```bash
# Copy contents of supabase/schema.sql and run in Supabase SQL Editor
```

3. Go to **Storage → Create bucket**:
   - Name: `blog-images`
   - Public: ✅ enabled
   - Max file size: `5242880` (5 MB)
   - Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif, image/svg+xml`

4. Create your admin user: **Auth → Users → Add User**

### 3. Configure environment variables

Copy `.env.local` and fill in your values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
scalevyn-blog/
├── app/
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── page.tsx                # Landing page → /blog
│   ├── globals.css             # Design system, prose styles
│   ├── not-found.tsx           # Global 404
│   ├── robots.ts               # robots.txt
│   ├── sitemap.ts              # Dynamic sitemap (all posts)
│   ├── blog/
│   │   ├── page.tsx            # /blog — listing + tag filter + pagination
│   │   ├── loading.tsx         # Loading skeleton
│   │   └── [slug]/
│   │       ├── page.tsx        # /blog/[slug] — post detail + JSON-LD
│   │       ├── loading.tsx     # Loading skeleton
│   │       └── not-found.tsx   # 404 for missing posts
│   ├── admin/
│   │   ├── layout.tsx          # Auth guard + AdminNavbar
│   │   ├── page.tsx            # /admin — dashboard with stats + table
│   │   ├── loading.tsx         # Loading skeleton
│   │   ├── create/page.tsx     # /admin/create — new post
│   │   └── edit/[id]/page.tsx  # /admin/edit/[id] — edit post
│   ├── login/page.tsx          # Login page (Supabase Auth)
│   └── api/
│       ├── posts/route.ts      # GET list, POST create
│       ├── posts/[id]/route.ts # PUT update, PATCH partial, DELETE soft
│       └── upload/route.ts     # POST image upload → Supabase Storage
├── components/
│   ├── Navbar.tsx              # Public blog navbar
│   ├── Footer.tsx              # Blog footer
│   ├── BlogCard.tsx            # Featured + regular card variants
│   ├── MarkdownRenderer.tsx    # react-markdown + YouTube + code highlight
│   ├── ShareButtons.tsx        # Twitter, LinkedIn, copy-link
│   ├── Pagination.tsx          # Page navigation
│   └── admin/
│       ├── AdminNavbar.tsx     # Sticky admin nav + logout
│       ├── PostEditor.tsx      # Full editor (markdown, images, tags)
│       └── PostTable.tsx       # Table with inline publish/delete
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client (cookies)
│   │   └── admin.ts            # Service role client (storage)
│   ├── queries/posts.ts        # All DB query helpers
│   └── utils.ts                # slug, date, readTime, excerpt
├── types/
│   └── database.ts             # TypeScript types for DB schema
├── supabase/
│   └── schema.sql              # Full PostgreSQL schema + RLS + Storage
├── docs/                       # AI development memory logs
│   ├── 01-project-setup.md
│   ├── 02-database-schema.md
│   ├── 03-blog-pages.md
│   ├── 04-admin-panel.md
│   └── 05-api-routes.md
├── proxy.ts                    # Auth guard proxy (Next.js 16)
└── next.config.ts              # Image domains, headers
```

---

## 🌐 Pages

| Route | Type | Description |
|---|---|---|
| `/` | Static | Landing → links to blog |
| `/blog` | ISR (60s) | Post listing with pagination & tags |
| `/blog/[slug]` | SSG + ISR | Post detail with JSON-LD |
| `/login` | Static | Supabase Auth login |
| `/admin` | Dynamic | Dashboard (auth required) |
| `/admin/create` | Dynamic | New post editor |
| `/admin/edit/[id]` | Dynamic | Edit post |
| `/sitemap.xml` | Dynamic | All published posts |
| `/robots.txt` | Static | Crawler rules |

---

## 🔑 Admin Usage

1. Visit `/login` and sign in with your Supabase admin email/password
2. **Create** → `/admin/create` — write in Markdown, upload cover, add tags, publish
3. **Edit** → click Edit icon in the dashboard table
4. **Delete** → click Delete (soft-delete, recoverable in DB)
5. **Toggle publish** → click the status badge in the table

---

## 🗄️ Database Schema

```sql
posts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,          -- URL: /blog/my-post
  content      TEXT NOT NULL,                 -- Markdown
  excerpt      TEXT,                          -- SEO description
  cover_image  TEXT,                          -- Supabase Storage URL
  tags         TEXT[],                        -- e.g. ["Next.js","SEO"]
  published    BOOLEAN DEFAULT false,         -- draft/live toggle
  deleted      BOOLEAN DEFAULT false,         -- soft delete
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()      -- auto-updated via trigger
)
```

---

## ⚡ Performance

- **ISR** — blog listing revalidates every 60 seconds
- **SSG** — all published posts pre-rendered at build time via `generateStaticParams`
- **Next.js Image** — automatic AVIF/WebP conversion, lazy loading
- **Loading skeletons** — instant perceived performance on all routes
- **Minimal JS** — Server Components used wherever possible

---

## 🔍 SEO

- Per-post `generateMetadata()` → title, description, canonical
- Open Graph + Twitter Card images
- JSON-LD `BlogPosting` structured data on every post
- Dynamic `sitemap.xml` including all published posts
- `robots.txt` — blocks `/admin` and `/api`

---

## 🚢 Deploy to Vercel

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "initial commit"

# 2. Import project in vercel.com
# 3. Add environment variables in Vercel dashboard:
#    NEXT_PUBLIC_SUPABASE_URL
#    NEXT_PUBLIC_SUPABASE_ANON_KEY
#    SUPABASE_SERVICE_ROLE_KEY
#    NEXT_PUBLIC_SITE_URL=https://blog.scalevyn.com

# 4. Deploy → Vercel handles the rest
```

---

## 📝 AI Development Logs

All development steps are documented in `/docs/`:

| File | Contents |
|---|---|
| `01-project-setup.md` | Stack, env vars, file structure |
| `02-database-schema.md` | SQL schema, RLS, storage setup |
| `03-blog-pages.md` | Public pages, ISR, SEO |
| `04-admin-panel.md` | CRUD flow, editor, auth |
| `05-api-routes.md` | All API endpoints reference |

When resuming development, read these files first to understand current progress.

---

## 🔮 Future Roadmap (not yet implemented)

- [ ] PostHog analytics
- [ ] Newsletter subscription
- [ ] Lead capture forms
- [ ] Multi-author support
- [ ] AI blog generator
- [ ] Reading progress bar
- [ ] Table of contents sidebar

---

## 📄 License

MIT © [Scalevyn](https://scalevyn.com)
