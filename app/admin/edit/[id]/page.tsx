import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostByIdAdmin } from "@/lib/queries/posts";
import PostEditor from "@/components/admin/PostEditor";

export const metadata: Metadata = { title: "Edit Post — Admin" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostByIdAdmin(id);

  if (!post) notFound();

  return <PostEditor post={post} />;
}
