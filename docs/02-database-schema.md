# 02 — Database Schema

## Overview
Defined the full PostgreSQL schema, RLS policies, storage bucket config, and TypeScript types.

## Files Created/Updated
- `supabase/schema.sql` — full SQL to run in Supabase dashboard
- `types/database.ts` — TypeScript types matching schema

## Database Changes

### Posts Table
```sql
CREATE TABLE public.posts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  content      TEXT NOT NULL DEFAULT '',
  excerpt      TEXT,
  cover_image  TEXT,
  tags         TEXT[] DEFAULT '{}',
  published    BOOLEAN NOT NULL DEFAULT false,
  deleted      BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Indexes
```sql
CREATE INDEX posts_slug_idx       ON public.posts (slug);
CREATE INDEX posts_published_idx  ON public.posts (published, deleted);
CREATE INDEX posts_created_at_idx ON public.posts (created_at DESC);
```

### Trigger (auto-update `updated_at`)
```sql
CREATE OR REPLACE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

## RLS Policies
| Policy | Role | Action |
|---|---|---|
| Public read published posts | `public` | SELECT where published=true AND deleted=false |
| Authenticated full access | `authenticated` | ALL |

## Storage Bucket Setup
1. Go to Supabase Dashboard → Storage
2. Create bucket: **`blog-images`**
3. Set **Public** = ✅
4. Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif, image/svg+xml`
5. Max upload size: **5MB**
6. Storage RLS policies in `schema.sql`

## Pending Tasks
- [ ] Add `author` field (future multi-author support)
- [ ] Consider full-text search index

## Notes
- Soft delete pattern used (`deleted = true`) to prevent accidental data loss
- `updated_at` trigger fires automatically on any UPDATE
