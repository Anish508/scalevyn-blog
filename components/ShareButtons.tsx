"use client";

import { Share2, Copy } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.scalevyn.com";
  const url = `${siteUrl}/blog/${slug}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-slate-500">Share:</span>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        aria-label="Share on Twitter"
      >
        <Share2 className="w-4 h-4 text-slate-600" />
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        aria-label="Share on LinkedIn"
      >
        <Share2 className="w-4 h-4 text-slate-600" />
      </a>

      <button
        onClick={() => navigator.clipboard.writeText(url)}
        className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
        aria-label="Copy link"
        type="button"
      >
        <Copy className="w-4 h-4 text-slate-600" />
      </button>
    </div>
  );
}
