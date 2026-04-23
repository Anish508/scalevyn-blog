import Link from "next/link";
import { BookOpen, Share2 } from "lucide-react";

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
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
            </a>
            <a
              href="https://linkedin.com/company/scalevyn"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors"
              title="Follow on LinkedIn"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
