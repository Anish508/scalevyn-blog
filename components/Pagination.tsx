import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {currentPage > 1 && (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-brand-300 hover:text-brand-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </Link>
      )}

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Link
            key={page}
            href={`${basePath}?page=${page}`}
            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-brand-700 text-white"
                : "text-slate-600 hover:bg-brand-50 hover:text-brand-700"
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      {currentPage < totalPages && (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:border-brand-300 hover:text-brand-700 transition-colors"
        >
          Next <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
