import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { PostUpdate } from "@/types/database";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT /api/posts/[id] — full update (edit)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { title, slug, content, excerpt, cover_image, tags, published } = body;

  if (!title?.trim() || !slug?.trim() || !content?.trim()) {
    return NextResponse.json(
      { error: "title, slug, and content are required" },
      { status: 400 },
    );
  }

  const updatePayload = {
    title: title.trim(),
    slug: slug.trim(),
    content,
    excerpt: excerpt?.trim() || null,
    cover_image: cover_image || null,
    tags: tags ?? [],
    published: published ?? false,
  } as PostUpdate;

  const { data, error } = await supabase
    .from("posts")
    // @ts-expect-error - Supabase SDK type inference limitation
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    const msg =
      error.code === "23505"
        ? "A post with this slug already exists"
        : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  return NextResponse.json(data);
}

// PATCH /api/posts/[id] — partial update (toggle publish)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const { data, error } = await supabase
    .from("posts")
    // @ts-expect-error - Supabase SDK type inference limitation
    .update(body as PostUpdate)
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

// DELETE /api/posts/[id] — soft delete
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { error } = await supabase
    .from("posts")
    // @ts-expect-error - Supabase SDK type inference limitation
    .update({ deleted: true } as PostUpdate)
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
