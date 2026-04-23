"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, X, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

const platforms = [
  {
    name: "WhatsApp",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    color: "bg-[#25D366] hover:bg-[#1ebe57]",
    getUrl: (url: string, title: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(title + " " + url)}`,
  },
  {
    name: "Twitter",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: "bg-[#0f1419] hover:bg-[#272c30]",
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: "bg-[#0A66C2] hover:bg-[#004182]",
    getUrl: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    name: "Email",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4 fill-none stroke-current"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    color: "bg-slate-600 hover:bg-slate-700",
    getUrl: (url: string, title: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent("Check out this article: " + url)}`,
  },
];

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.scalevyn.com";
  const url = `${siteUrl}/blog/${slug}`;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function handleCopy() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-brand-700 bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 px-4 py-2 rounded-xl transition-colors shadow-sm"
        type="button"
        aria-label="Share this article"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 bottom-full mb-2 w-64 sm:w-56 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-2 py-1.5 mb-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Share via
            </span>
            <button
              onClick={() => setOpen(false)}
              className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              type="button"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Platforms */}
          {platforms.map((p) => (
            <a
              key={p.name}
              href={p.getUrl(url, title)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors group"
            >
              <span
                className={`w-8 h-8 rounded-lg ${p.color} text-white flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}
              >
                {p.icon}
              </span>
              {p.name}
            </a>
          ))}

          {/* Divider */}
          <div className="border-t border-slate-100 my-1" />

          {/* Copy link */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-3 px-2 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors w-full group"
            type="button"
          >
            <span className="w-8 h-8 rounded-lg bg-brand-600 hover:bg-brand-700 text-white flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 fill-none stroke-current"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </span>
            {copied ? "Link copied!" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}
