-- ============================================================
-- Scalevyn Blog — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ─── Enable UUID Extension ────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Posts Table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.posts (
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

-- ─── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS posts_slug_idx        ON public.posts (slug);
CREATE INDEX IF NOT EXISTS posts_published_idx   ON public.posts (published, deleted);
CREATE INDEX IF NOT EXISTS posts_created_at_idx  ON public.posts (created_at DESC);

-- ─── Updated At Trigger ───────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Row Level Security ───────────────────────────────────────
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published, non-deleted posts
CREATE POLICY "Public can read published posts"
  ON public.posts
  FOR SELECT
  USING (published = true AND deleted = false);

-- Authenticated users (admin) have full access
CREATE POLICY "Authenticated users have full access"
  ON public.posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ─── Storage: blog-images bucket ─────────────────────────────
-- Run in Supabase Dashboard → Storage → Create bucket
-- Bucket name: blog-images
-- Public: true
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif, image/svg+xml
-- Max file size: 5242880 (5MB)

-- Storage RLS policies (run after creating bucket)
-- Allow public to read
CREATE POLICY "Public can read blog images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'blog-images');

-- Only authenticated users can upload
CREATE POLICY "Authenticated users can upload blog images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

-- Only authenticated users can delete
CREATE POLICY "Authenticated users can delete blog images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-images');
