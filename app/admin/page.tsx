import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostsAdmin } from "@/lib/queries/posts";
import PostTable from "@/components/admin/PostTable";
import { PenLine, BookOpen, FileText, Eye } from "lucide-react";

export const metadata: Metadata = { title: "Admin Dashboard" };

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const posts = await getAllPostsAdmin();

  const published = posts.filter((p) => p.published).length;
  const drafts = posts.filter((p) => !p.published).length;

  const stats = [
    { label: "Total Posts", value: posts.length, icon: FileText, color: "bg-slate-100 text-slate-600" },
    { label: "Published", value: published, icon: Eye, color: "bg-brand-50 text-brand-700" },
    { label: "Drafts", value: drafts, icon: BookOpen, color: "bg-amber-50 text-amber-700" },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Blog Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage and publish your blog content
          </p>
        </div>
        <Link
          href="/admin/create"
          className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-sm"
        >
          <PenLine className="w-4 h-4" /> New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card shadow-card p-4 sm:p-5">
            <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-4.5 h-4.5" />
            </div>
            <p className="font-display font-bold text-2xl text-slate-900">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Posts table */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display font-semibold text-lg text-slate-900">All Posts</h2>
        <span className="text-xs text-slate-400">{posts.length} total</span>
      </div>

      <PostTable posts={posts} />
    </div>
  );
}
