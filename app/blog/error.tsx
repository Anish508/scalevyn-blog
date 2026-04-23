"use client";

import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <h2 className="font-display font-bold text-xl text-slate-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          {error.message?.includes("schema cache")
            ? "Database not configured. Please set your Supabase environment variables."
            : "An unexpected error occurred while loading the blog."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 text-sm font-semibold bg-brand-700 text-white px-4 py-2 rounded-lg hover:bg-brand-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
