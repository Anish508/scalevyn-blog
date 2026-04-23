import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link href="/blog" className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-md bg-gradient-brand flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white" />
            </span>
            <span className="font-display font-bold text-slate-900">
              Scalevyn Blog
            </span>
          </Link>

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Scalevyn. Expert insights on tech &
            growth.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="https://twitter.com/scalevyn"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors"
              title="Follow on X (Twitter)"
            >
              {/* X (Twitter) icon */}
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-slate-500">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/company/scalevyn"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors"
              title="Follow on LinkedIn"
            >
              {/* LinkedIn icon */}
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-slate-500">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
