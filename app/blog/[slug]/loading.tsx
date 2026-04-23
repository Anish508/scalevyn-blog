export default function BlogPostLoading() {
  return (
    <div className="animate-pulse">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-8">
        {/* Back link */}
        <div className="h-4 w-28 bg-slate-200 rounded mb-8" />

        {/* Tags */}
        <div className="flex gap-2 mb-5">
          <div className="h-6 w-20 bg-slate-100 rounded-full" />
          <div className="h-6 w-16 bg-slate-100 rounded-full" />
        </div>

        {/* Title */}
        <div className="space-y-3 mb-5">
          <div className="h-10 w-full bg-slate-200 rounded-lg" />
          <div className="h-10 w-3/4 bg-slate-200 rounded-lg" />
        </div>

        {/* Excerpt */}
        <div className="h-6 w-full bg-slate-100 rounded mb-2" />
        <div className="h-6 w-2/3 bg-slate-100 rounded mb-6" />

        {/* Meta row */}
        <div className="flex items-center gap-4 pb-8 border-b border-slate-100">
          <div className="h-4 w-32 bg-slate-100 rounded" />
          <div className="h-4 w-24 bg-slate-100 rounded" />
        </div>
      </div>

      {/* Cover image */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-10">
        <div className="h-96 w-full bg-slate-200 rounded-2xl" />
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 space-y-4">
        {[100, 90, 80, 100, 70, 95, 60, 85].map((w, i) => (
          <div key={i} className={`h-4 w-[${w}%] bg-slate-100 rounded`} />
        ))}
        <div className="h-48 w-full bg-slate-100 rounded-xl mt-6" />
        {[100, 88, 75, 100, 60].map((w, i) => (
          <div key={`b-${i}`} className="h-4 bg-slate-100 rounded" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}
