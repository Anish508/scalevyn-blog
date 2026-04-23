"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import Image from "next/image";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

const components: Components = {
  // Optimized Next.js image rendering
  img({ src, alt, ...props }) {
    if (!src) return null;

    // YouTube embed detection
    const ytMatch = (src as string).match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    if (ytMatch) {
      return (
        <div className="relative w-full aspect-video my-6 rounded-xl overflow-hidden shadow-card">
          <iframe
            src={`https://www.youtube.com/embed/${ytMatch[1]}`}
            title={alt ?? "YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      );
    }

    return (
      <span className="block my-6">
        <Image
          src={src as string}
          alt={alt ?? "Blog image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 900px"
          className="rounded-xl w-full h-auto shadow-card object-cover"
        />
        {alt && (
          <span className="block text-center text-sm text-slate-400 mt-2 italic">
            {alt}
          </span>
        )}
      </span>
    );
  },

  // YouTube iframes in raw HTML
  iframe({ src, title, ...props }) {
    return (
      <div className="relative w-full aspect-video my-6 rounded-xl overflow-hidden shadow-card">
        <iframe
          src={src}
          title={title ?? "Embedded video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          {...props}
        />
      </div>
    );
  },

  // Styled anchor links
  a({ href, children, ...props }) {
    const isExternal = href?.startsWith("http");
    return (
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },

  // Code blocks
  pre({ children, ...props }) {
    return (
      <pre
        className="not-prose bg-slate-900 text-slate-100 rounded-xl p-5 overflow-x-auto text-sm leading-relaxed my-6 border border-slate-800"
        {...props}
      >
        {children}
      </pre>
    );
  },

  // Blockquote
  blockquote({ children, ...props }) {
    return (
      <blockquote
        className="not-prose border-l-4 border-brand-400 pl-5 py-1 my-5 text-slate-600 italic text-lg leading-relaxed bg-brand-50/40 rounded-r-lg"
        {...props}
      >
        {children}
      </blockquote>
    );
  },
};

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-slate prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
