import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-5">
          <FileQuestion className="w-8 h-8 text-slate-400" />
        </div>
        <h1 className="font-display font-bold text-3xl text-slate-900 mb-2">Post Not Found</h1>
        <p className="text-slate-500 mb-6">
          This article doesn't exist or may have been removed.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-800 transition-colors text-sm"
        >
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
}
