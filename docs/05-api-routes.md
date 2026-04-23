# 05 — API Routes

## Overview
All API routes are under `app/api/`. They are auth-guarded (except public read), handle validation, and use Supabase server client.

## Files Created
- `app/api/posts/route.ts` — GET all, POST create
- `app/api/posts/[id]/route.ts` — PUT (edit), PATCH (partial), DELETE (soft)
- `app/api/upload/route.ts` — multipart image upload to Supabase Storage

## API Reference

### Posts

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/posts` | ✅ | List all posts (incl. drafts) |
| POST | `/api/posts` | ✅ | Create new post |
| PUT | `/api/posts/[id]` | ✅ | Full update |
| PATCH | `/api/posts/[id]` | ✅ | Partial update (publish toggle) |
| DELETE | `/api/posts/[id]` | ✅ | Soft delete |

### Upload

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/upload` | ✅ | Upload image → returns `{ url, path }` |

## Key Code Snippets

### Create post
```ts
const { data, error } = await supabase
  .from("posts")
  .insert({ title, slug, content, excerpt, cover_image, tags, published, deleted: false, ... })
  .select().single();
```

### Duplicate slug error handling
```ts
const msg = error.code === "23505"
  ? "A post with this slug already exists"
  : error.message;
```

### Image upload
```ts
// Uses admin client (service role) to bypass storage RLS
const { data } = await adminSupabase.storage
  .from("blog-images")
  .upload(filename, fileBuffer, { contentType: file.type });

const { data: { publicUrl } } = adminSupabase.storage
  .from("blog-images")
  .getPublicUrl(data.path);
```

## Validation Rules
- `title`, `slug`, `content` are required
- Max file size: **5MB**
- Allowed image types: JPEG, PNG, WebP, GIF, SVG
- All write endpoints require authenticated session

## Error Responses
```json
{ "error": "Human-readable error message" }
```

## Pending Tasks
- [ ] Rate limiting on public endpoints
- [ ] Image compression before upload

## Notes
- Storage uploads use `adminClient` (service role) because storage RLS policies block authenticated session tokens in server-side contexts
- All auth checks use `supabase.auth.getUser()` (not `getSession()`) for security
