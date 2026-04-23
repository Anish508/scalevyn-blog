import Link from "next/link";
import { Clock, Calendar, ArrowRight } from "lucide-react";
import type { Post } from "@/types/database";
import { formatDateShort, estimateReadTime } from "@/lib/utils";

interface BlogCardProps {
  post: Post;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const readTime = estimateReadTime(post.content);

  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group block card shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
      >
        {/* Cover image */}
        <div className="relative w-full h-64 sm:h-72 bg-slate-100 overflow-hidden">
          {post.cover_image ? (
            <img
              src={post.cover_image}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="eager"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-800 to-brand-600 flex items-center justify-center">
              <span className="text-white/20 text-8xl font-display font-bold select-none">S</span>
            </div>
          )}
          {/* Featured badge */}
          <span className="absolute top-4 left-4 bg-brand-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Featured
          </span>
        </div>

        <div className="p-6 sm:p-8">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs font-medium text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-snug mb-3 group-hover:text-brand-700 transition-colors">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-slate-500 text-base leading-relaxed mb-5 line-clamp-3">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDateShort(post.created_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {readTime} min read
              </span>
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold text-brand-700 group-hover:gap-2 transition-all">
              Read more <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col card shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
    >
      {/* Cover image */}
      <div className="relative w-full h-44 bg-slate-100 overflow-hidden flex-shrink-0">
        {post.cover_image ? (
          <img
            src={post.cover_image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-900 to-brand-700 flex items-center justify-center">
            <span className="text-white/20 text-6xl font-display font-bold select-none">S</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h3 className="font-display font-bold text-lg text-slate-900 leading-snug mb-2 group-hover:text-brand-700 transition-colors line-clamp-2 flex-1">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center gap-3 text-xs text-slate-400 mt-auto pt-3 border-t border-slate-50">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDateShort(post.created_at)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {readTime} min
          </span>
        </div>
      </div>
    </Link>
  );
}
