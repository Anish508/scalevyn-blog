import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Post, PostInsert, PostUpdate } from "@/types/database";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns true if Supabase env vars are configured. */
function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_project_url" &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "your_supabase_anon_key"
  );
}

// ─── Public Queries ────────────────────────────────────────────────────────────

export async function getPublishedPosts(limit = 50): Promise<Post[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .eq("deleted", false)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[getPublishedPosts]", error.message);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("[getPublishedPosts] unexpected error:", err);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .eq("deleted", false)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .eq("deleted", false)
      .contains("tags", [tag])
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getPostsByTag]", error.message);
      return [];
    }
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("posts")
      .select("slug")
      .eq("published", true)
      .eq("deleted", false);

    if (error) return [];
    return (data as { slug: string }[]).map((p) => p.slug);
  } catch {
    return [];
  }
}

// ─── Admin Queries ─────────────────────────────────────────────────────────────

export async function getAllPostsAdmin(): Promise<Post[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("deleted", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[getAllPostsAdmin]", error.message);
      return [];
    }
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getPostByIdAdmin(id: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function createPost(post: PostInsert): Promise<Post> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    // @ts-expect-error - Supabase SDK type inference limitation
    .insert(post)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Post;
}

export async function updatePost(id: string, updates: PostUpdate): Promise<Post> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    // @ts-expect-error - Supabase SDK type inference limitation
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Post;
}

export async function softDeletePost(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    // @ts-expect-error - Supabase SDK type inference limitation
    .update({ deleted: true, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function togglePublishPost(id: string, published: boolean): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    // @ts-expect-error - Supabase SDK type inference limitation
    .update({ published, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw new Error(error.message);
}
