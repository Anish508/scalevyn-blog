"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Post } from "@/types/database";
import { formatDateShort } from "@/lib/utils";
import {
  Edit2, Trash2, Eye, EyeOff, ExternalLink, Clock,
  CheckCircle2, FileText, AlertTriangle
} from "lucide-react";

interface PostTableProps {
  posts: Post[];
}

interface DeleteModalProps {
  post: Post;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}

function DeleteModal({ post, onConfirm, onCancel, loading }: DeleteModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </span>
          <div>
            <h3 className="font-display font-bold text-slate-900">Delete post?</h3>
            <p className="text-xs text-slate-400">This action can be undone in the database</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 bg-slate-50 rounded-lg px-4 py-3 mb-5 line-clamp-2">
          "{post.title}"
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-lg transition-colors"
          >
            {loading ? "Deleting…" : "Delete Post"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PostTable({ posts: initialPosts }: PostTableProps) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteLoading(true);

    const res = await fetch(`/api/posts/${deleteTarget.id}`, { method: "DELETE" });

    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showToast("Post deleted successfully");
    } else {
      showToast("Failed to delete post", "error");
    }

    setDeleteLoading(false);
    setDeleteTarget(null);
  }

  async function handleTogglePublish(post: Post) {
    setTogglingId(post.id);

    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published }),
    });

    if (res.ok) {
      setPosts((prev) =>
        prev.map((p) => (p.id === post.id ? { ...p, published: !p.published } : p))
      );
      showToast(!post.published ? "Post published!" : "Post unpublished");
    } else {
      showToast("Failed to update status", "error");
    }

    setTogglingId(null);
  }

  if (posts.length === 0) {
    return (
      <div className="card shadow-card flex flex-col items-center justify-center py-20 text-center">
        <FileText className="w-12 h-12 text-slate-300 mb-4" />
        <h3 className="font-display font-semibold text-slate-700 mb-1">No posts yet</h3>
        <p className="text-sm text-slate-400 mb-5">Create your first blog post to get started</p>
        <Link
          href="/admin/create"
          className="text-sm font-semibold bg-brand-700 text-white px-4 py-2 rounded-lg hover:bg-brand-800 transition-colors"
        >
          Create Post
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg text-white transition-all ${
            toast.type === "success" ? "bg-brand-700" : "bg-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          {toast.message}
        </div>
      )}

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          post={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      {/* Desktop table */}
      <div className="hidden md:block card shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3.5">Title</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3.5 w-32">Status</th>
              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3.5 w-36">Date</th>
              <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wide px-5 py-3.5 w-40">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-4">
                  <div>
                    <p className="font-medium text-slate-900 text-sm leading-snug line-clamp-1 mb-1">
                      {post.title}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-[10px] font-medium text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </td>

                <td className="px-4 py-4">
                  <button
                    onClick={() => handleTogglePublish(post)}
                    disabled={togglingId === post.id}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
                      post.published
                        ? "bg-brand-50 text-brand-700 hover:bg-brand-100"
                        : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                    } disabled:opacity-50`}
                  >
                    {post.published ? (
                      <><CheckCircle2 className="w-3 h-3" /> Published</>
                    ) : (
                      <><Clock className="w-3 h-3" /> Draft</>
                    )}
                  </button>
                </td>

                <td className="px-4 py-4 text-xs text-slate-400">
                  {formatDateShort(post.created_at)}
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1.5">
                    {post.published && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-700 hover:bg-brand-50 transition-colors"
                        title="View live"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    <Link
                      href={`/admin/edit/${post.id}`}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-brand-700 hover:bg-brand-50 transition-colors"
                      title="Edit post"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(post)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="card shadow-card p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-medium text-slate-900 text-sm leading-snug line-clamp-2 flex-1">
                {post.title}
              </h3>
              <span
                className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  post.published ? "bg-brand-50 text-brand-700" : "bg-amber-50 text-amber-700"
                }`}
              >
                {post.published ? "Published" : "Draft"}
              </span>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-[10px] font-medium text-brand-700 bg-brand-50 px-1.5 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{formatDateShort(post.created_at)}</span>
              <div className="flex gap-2">
                <Link href={`/admin/edit/${post.id}`} className="text-brand-700 font-medium">Edit</Link>
                <button onClick={() => handleTogglePublish(post)} className="text-slate-500 font-medium">
                  {post.published ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => setDeleteTarget(post)} className="text-red-500 font-medium">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
