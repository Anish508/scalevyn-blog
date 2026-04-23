export default function BlogLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-10">
        <div className="h-9 w-64 bg-slate-200 rounded-lg mb-3" />
        <div className="h-4 w-40 bg-slate-100 rounded" />
      </div>

      {/* Tag filter chips skeleton */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-7 w-16 bg-slate-100 rounded-full" />
        ))}
      </div>

      {/* Featured card skeleton */}
      <div className="card shadow-card overflow-hidden mb-8">
        <div className="h-72 w-full bg-slate-200" />
        <div className="p-8">
          <div className="flex gap-2 mb-3">
            <div className="h-5 w-20 bg-slate-100 rounded-full" />
            <div className="h-5 w-16 bg-slate-100 rounded-full" />
          </div>
          <div className="h-8 w-3/4 bg-slate-200 rounded-lg mb-3" />
          <div className="h-4 w-full bg-slate-100 rounded mb-2" />
          <div className="h-4 w-2/3 bg-slate-100 rounded" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card shadow-card overflow-hidden">
            <div className="h-44 w-full bg-slate-200" />
            <div className="p-5">
              <div className="h-4 w-16 bg-slate-100 rounded-full mb-2" />
              <div className="h-5 w-full bg-slate-200 rounded mb-1" />
              <div className="h-5 w-3/4 bg-slate-200 rounded mb-3" />
              <div className="h-3 w-1/2 bg-slate-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
