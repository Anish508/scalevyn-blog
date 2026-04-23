"use client";

import Link from "next/link";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function AdminError({
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
          Admin Error
        </h2>
        <p className="text-slate-500 text-sm mb-1">
          {error.message?.includes("schema cache")
            ? "Supabase is not configured. Please add your environment variables."
            : error.message || "An unexpected error occurred."}
        </p>
        {error.message?.includes("schema cache") && (
          <p className="text-xs text-slate-400 mb-5 font-mono bg-slate-50 rounded px-3 py-2 mt-2">
            Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local
          </p>
        )}
        <div className="flex gap-3 justify-center mt-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 text-sm font-semibold bg-brand-700 text-white px-4 py-2 rounded-lg hover:bg-brand-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    </div>
  );
}
