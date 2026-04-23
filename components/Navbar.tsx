import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/blog" className="flex items-center gap-2.5 group">
          <span className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center shadow-sm">
            <BookOpen className="w-4 h-4 text-white" />
          </span>
          <div className="leading-tight">
            <span className="font-display font-bold text-slate-900 text-[0.95rem] tracking-tight">
              Scalevyn
            </span>
            <span className="text-[0.72rem] text-slate-400 block -mt-0.5">Blog</span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/blog" className="hover:text-brand-700 transition-colors">
            Articles
          </Link>
          <Link href="https://scalevyn.com" target="_blank" className="hover:text-brand-700 transition-colors flex items-center gap-1">
            Main Site <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </nav>

        {/* Admin CTA */}
        <Link
          href="/admin"
          className="text-xs font-semibold bg-brand-700 text-white px-3.5 py-1.5 rounded-lg hover:bg-brand-800 transition-colors"
        >
          Admin
        </Link>
      </div>
    </header>
  );
}
