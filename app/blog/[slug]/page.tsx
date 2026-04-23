import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import ShareButtons from "@/components/ShareButtons";
import { getPostBySlug, getAllPublishedSlugs, getPublishedPosts } from "@/lib/queries/posts";
import { formatDate, estimateReadTime } from "@/lib/utils";
import { Clock, Calendar, Tag, ArrowLeft } from "lucide-react";
import type { Post } from "@/types/database";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.scalevyn.com";

  return {
    title: post.title,
    description: post.excerpt ?? post.title,
    keywords: post.tags ?? [],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? post.title,
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
      tags: post.tags ?? [],
      images: post.cover_image
        ? [{ url: post.cover_image, width: 1200, height: 630, alt: post.title }]
        : [{ url: `${siteUrl}/og-default.png`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt ?? post.title,
      images: post.cover_image ? [post.cover_image] : [],
    },
  };
}

function JsonLd({ post }: { post: Post }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.scalevyn.com";
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? post.title,
    datePublished: post.created_at,
    dateModified: post.updated_at,
    url: `${siteUrl}/blog/${post.slug}`,
    image: post.cover_image ?? `${siteUrl}/og-default.png`,
    publisher: {
      "@type": "Organization",
      name: "Scalevyn",
      url: "https://scalevyn.com",
      logo: { "@type": "ImageObject", url: `${siteUrl}/logo.png` },
    },
    author: {
      "@type": "Organization",
      name: "Scalevyn Team",
      url: "https://scalevyn.com",
    },
    keywords: (post.tags ?? []).join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const readTime = estimateReadTime(post.content);

  // Fetch related posts (same tags, exclude current)
  const allPosts = await getPublishedPosts(50);
  const related = allPosts
    .filter(
      (p) =>
        p.slug !== post.slug &&
        p.tags?.some((t) => post.tags?.includes(t))
    )
    .slice(0, 3);

  return (
    <>
      <JsonLd post={post} />
      <Navbar />

      <main>
        {/* Hero */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-700 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> All articles
          </Link>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1 rounded-full border border-brand-100 transition-colors"
                >
                  <Tag className="w-3 h-3" /> {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight leading-tight mb-5">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg sm:text-xl text-slate-500 leading-relaxed mb-6">
              {post.excerpt}
            </p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 pb-8 border-b border-slate-100">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {formatDate(post.created_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {readTime} min read
            </span>
            <div className="ml-auto">
              <ShareButtons title={post.title} slug={post.slug} />
            </div>
          </div>
        </div>

        {/* Cover image */}
        {post.cover_image && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-10">
            <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden shadow-card">
              <img
                src={post.cover_image}
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <MarkdownRenderer content={post.content} />

          {/* Bottom share + tags */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 px-3 py-1 rounded-full border border-brand-100 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
            <div className="w-full sm:w-auto flex sm:justify-end">
              <ShareButtons title={post.title} slug={post.slug} />
            </div>
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="bg-slate-50 border-t border-slate-100 py-14">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <h2 className="font-display font-bold text-2xl text-slate-900 mb-7">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/blog/${p.slug}`}
                    className="card shadow-card hover:shadow-card-hover transition-all p-5 group"
                  >
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {(p.tags ?? []).slice(0, 2).map((t) => (
                        <span key={t} className="text-xs font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-display font-semibold text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-2 mb-2">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-400">{formatDate(p.created_at)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
