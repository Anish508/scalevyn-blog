import type { Metadata } from "next";
import PostEditor from "@/components/admin/PostEditor";

export const metadata: Metadata = { title: "Create Post — Admin" };

export default function CreatePostPage() {
  return <PostEditor />;
}
