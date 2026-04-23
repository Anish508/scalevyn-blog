import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// POST /api/upload — upload image to Supabase Storage
export async function POST(request: NextRequest) {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const bucket = (formData.get("bucket") as string) || "blog-images";
  const folder = (formData.get("folder") as string) || "general";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  // Max 5MB
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const fileBuffer = new Uint8Array(arrayBuffer);

  // Use admin client to bypass RLS on storage
  const adminSupabase = createAdminClient();
  const { data, error } = await adminSupabase.storage
    .from(bucket)
    .upload(filename, fileBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: { publicUrl } } = adminSupabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return NextResponse.json({ url: publicUrl, path: data.path });
}
