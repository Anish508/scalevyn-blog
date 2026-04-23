export default function AdminLoading() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="h-8 w-52 bg-slate-200 rounded-lg mb-2" />
          <div className="h-4 w-36 bg-slate-100 rounded" />
        </div>
        <div className="h-10 w-28 bg-slate-200 rounded-xl" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card shadow-card p-5">
            <div className="w-9 h-9 bg-slate-100 rounded-xl mb-3" />
            <div className="h-7 w-12 bg-slate-200 rounded mb-1" />
            <div className="h-3 w-20 bg-slate-100 rounded" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="card shadow-card overflow-hidden">
        <div className="h-12 bg-slate-50 border-b border-slate-100" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-slate-50">
            <div className="flex-1">
              <div className="h-4 w-3/4 bg-slate-200 rounded mb-1.5" />
              <div className="flex gap-1.5">
                <div className="h-4 w-16 bg-slate-100 rounded-full" />
                <div className="h-4 w-12 bg-slate-100 rounded-full" />
              </div>
            </div>
            <div className="h-6 w-20 bg-slate-100 rounded-full" />
            <div className="h-4 w-24 bg-slate-100 rounded" />
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-slate-100 rounded-lg" />
              <div className="w-8 h-8 bg-slate-100 rounded-lg" />
              <div className="w-8 h-8 bg-slate-100 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
