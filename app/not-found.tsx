import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50">
      <div className="text-center max-w-md">
        <p className="text-6xl font-display font-bold text-slate-200 mb-2">404</p>
        <div className="w-14 h-14 rounded-xl bg-white border border-slate-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
          <FileQuestion className="w-7 h-7 text-slate-400" />
        </div>
        <h1 className="font-display font-bold text-2xl text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-slate-500 text-sm mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-800 transition-colors text-sm"
        >
          Go to Blog
        </Link>
      </div>
    </div>
  );
}
