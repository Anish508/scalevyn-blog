# 03 — Blog Pages (Public)

## Overview
Built the public-facing blog listing page, blog detail page, and supporting components. Fully SEO-optimized with ISR.

## Files Created
- `app/blog/page.tsx` — listing with pagination, tag filter, featured post
- `app/blog/[slug]/page.tsx` — detail page with JSON-LD, related posts
- `components/BlogCard.tsx` — featured + regular card variants
- `components/MarkdownRenderer.tsx` — client-side renderer with YouTube support
- `components/ShareButtons.tsx` — Twitter, LinkedIn, copy link
- `components/Navbar.tsx` — public nav
- `components/Footer.tsx` — blog footer
- `components/Pagination.tsx` — page navigation

## Key Code Snippets

### ISR on blog listing
```ts
export const revalidate = 60; // seconds
```

### Static path generation for blog detail
```ts
export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}
```

### JSON-LD structured data
```tsx
const schema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  datePublished: post.created_at,
  ...
};
```

## SEO Features
- `generateMetadata()` for per-post Open Graph + Twitter cards
- Canonical URLs
- Structured data (JSON-LD BlogPosting schema)
- ISR with 60s revalidation
- `generateStaticParams()` for SSG at build time

## APIs Used
- `getPublishedPosts()` — paginated listing
- `getPostBySlug()` — single post fetch
- `getAllPublishedSlugs()` — static param generation

## Pending Tasks
- [ ] Add reading progress bar
- [ ] Table of contents sidebar for long posts

## Notes
- YouTube URLs in markdown `img` syntax are auto-converted to iframes
- Featured post = first post on page 1 (no tag filter)
- Tag filter chips are `<a>` tags for crawler-friendly navigation
