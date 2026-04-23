import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-brand-50 via-white to-slate-50">
      <div className="text-center max-w-2xl">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-sm font-medium px-4 py-2 rounded-full border border-brand-100 mb-6">
          <BookOpen className="w-4 h-4" />
          Scalevyn Blog
        </div>

        <h1 className="font-display font-bold text-5xl sm:text-6xl text-slate-900 tracking-tight leading-tight mb-5">
          Insights for{" "}
          <span className="text-gradient">Builders &amp; Marketers</span>
        </h1>

        <p className="text-slate-500 text-lg leading-relaxed mb-8">
          Expert articles on web development, SEO, digital marketing, and
          startup growth — straight from the Scalevyn team.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-800 transition-colors"
          >
            Read the Blog <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="https://scalevyn.com"
            className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 font-semibold px-6 py-3 rounded-xl border border-slate-200 hover:border-brand-200 hover:text-brand-700 transition-colors"
          >
            Visit Scalevyn.com
          </Link>
        </div>
      </div>
    </main>
  );
}
