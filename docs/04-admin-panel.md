# 04 — Admin Panel

## Overview
Built a full CRUD admin panel protected by Supabase Auth. Includes post editor with markdown toolbar, image upload, tag management, and publish control.

## Files Created
- `app/login/page.tsx` — Supabase email/password login
- `app/admin/layout.tsx` — server-side auth guard, wraps AdminNavbar
- `app/admin/page.tsx` — dashboard: stats cards + post table
- `app/admin/create/page.tsx` — new post form
- `app/admin/edit/[id]/page.tsx` — edit existing post
- `components/admin/AdminNavbar.tsx` — sticky nav with logout
- `components/admin/PostEditor.tsx` — full-featured editor
- `components/admin/PostTable.tsx` — interactive table with inline actions
- `middleware.ts` — route-level protection for /admin/*

## Key Code Snippets

### Server-side auth guard (layout)
```tsx
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect("/login");
```

### PostEditor: slug auto-generation
```ts
function handleTitleChange(val: string) {
  setTitle(val);
  if (!slugManuallyEdited) {
    setSlug(generateSlug(val));   // "My Post Title" → "my-post-title"
  }
}
```

### Inline publish toggle (no page reload)
```ts
async function handleTogglePublish(post: Post) {
  await fetch(`/api/posts/${post.id}`, {
    method: "PATCH",
    body: JSON.stringify({ published: !post.published }),
  });
  // Optimistic UI update
  setPosts(prev => prev.map(p => p.id === post.id ? {...p, published: !p.published} : p));
}
```

## Admin Features
| Feature | Implementation |
|---|---|
| Login | Supabase Auth (email/password) |
| Logout | `supabase.auth.signOut()` |
| Create post | `POST /api/posts` |
| Edit post | `PUT /api/posts/[id]` |
| Delete post | `DELETE /api/posts/[id]` (soft delete) |
| Toggle publish | `PATCH /api/posts/[id]` |
| Upload cover image | `POST /api/upload` → Supabase Storage |
| Insert image in content | Same upload API, inserts `![alt](url)` in markdown |

## Pending Tasks
- [ ] Drag-and-drop image upload
- [ ] Live markdown preview panel

## Notes
- PostEditor works in both create/edit mode via the optional `post` prop
- Tags added by pressing Enter or comma — removed with X button
- Excerpt auto-generated from content if left empty
- Soft delete sets `deleted = true`, recoverable from Supabase dashboard
