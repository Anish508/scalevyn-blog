import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import Pagination from "@/components/Pagination";
import { getPublishedPosts } from "@/lib/queries/posts";
import { Search, Settings } from "lucide-react";

const isConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_project_url";

export const metadata: Metadata = {
  title: "Blog — Tech & Digital Marketing Insights",
  description:
    "Expert articles on web development, SEO, digital marketing, and startup growth from the Scalevyn team.",
  alternates: { canonical: "/blog" },
};

export const revalidate = 60; // ISR: revalidate every 60 seconds

const POSTS_PER_PAGE = 9;

interface BlogPageProps {
  searchParams: Promise<{ page?: string; tag?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const tagFilter = params.tag ?? "";

  let posts = await getPublishedPosts(200);

  // Filter by tag if provided
  if (tagFilter) {
    posts = posts.filter((p) => p.tags?.includes(tagFilter));
  }

  // All unique tags for filter bar
  const allTags = Array.from(
    new Set(posts.flatMap((p) => p.tags ?? []))
  ).sort();

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const paginatedPosts = posts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );
  const featuredPost = page === 1 && !tagFilter ? paginatedPosts[0] : null;
  const gridPosts = featuredPost ? paginatedPosts.slice(1) : paginatedPosts;

  return (
    <>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Setup banner — only visible when Supabase is not configured */}
        {!isConfigured && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3.5 mb-8 text-sm">
            <Settings className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold">Supabase not configured.</span>{" "}
              Add your keys to <code className="font-mono bg-amber-100 px-1 rounded">.env.local</code>:
              {" "}<code className="font-mono bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
              <code className="font-mono bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
              Then run the SQL in <code className="font-mono bg-amber-100 px-1 rounded">supabase/schema.sql</code>.
            </div>
          </div>
        )}
        {/* Page header */}
        <div className="mb-10">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 tracking-tight mb-2">
            {tagFilter ? (
              <>Articles tagged: <span className="text-brand-700">#{tagFilter}</span></>
            ) : (
              "Latest Articles"
            )}
          </h1>
          <p className="text-slate-500 text-base">
            {posts.length} article{posts.length !== 1 ? "s" : ""} on tech, SEO &amp; digital growth
          </p>
        </div>

        {/* Tag filter chips */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <a
              href="/blog"
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                !tagFilter
                  ? "bg-brand-700 text-white border-brand-700"
                  : "bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-700"
              }`}
            >
              All
            </a>
            {allTags.map((tag) => (
              <a
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  tagFilter === tag
                    ? "bg-brand-700 text-white border-brand-700"
                    : "bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-700"
                }`}
              >
                #{tag}
              </a>
            ))}
          </div>
        )}

        {/* No results */}
        {paginatedPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search className="w-12 h-12 text-slate-300 mb-4" />
            <h2 className="font-display font-semibold text-xl text-slate-700 mb-2">No articles yet</h2>
            <p className="text-slate-400 text-sm">
              {tagFilter ? `No posts found with tag "#${tagFilter}"` : "Check back soon for fresh content!"}
            </p>
          </div>
        )}

        {/* Featured post (first article on page 1) */}
        {featuredPost && (
          <div className="mb-8">
            <BlogCard post={featuredPost} featured />
          </div>
        )}

        {/* Blog grid */}
        {gridPosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {gridPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/blog"
        />
      </main>

      <Footer />
    </>
  );
}
