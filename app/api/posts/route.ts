import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils";
import type { PostInsert } from "@/types/database";

// GET /api/posts — list all posts (admin, includes drafts)
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("deleted", false)
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/posts — create a new post
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  // Auth check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { title, slug, content, excerpt, cover_image, tags, published } = body;

  if (!title?.trim() || !slug?.trim() || !content?.trim()) {
    return NextResponse.json(
      { error: "title, slug, and content are required" },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();

  const insertPayload: PostInsert = {
    title: title.trim(),
    slug: slug.trim(),
    content,
    excerpt: excerpt?.trim() || null,
    cover_image: cover_image || null,
    tags: tags ?? [],
    published: published ?? false,
    deleted: false,
    created_at: now,
    updated_at: now,
  };

  const { data, error } = await supabase
    .from("posts")
    // @ts-expect-error - Supabase SDK type inference limitation
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    const msg =
      error.code === "23505"
        ? "A post with this slug already exists"
        : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
