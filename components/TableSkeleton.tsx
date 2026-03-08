export function TableSkeleton() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-slate-100 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-100 rounded w-1/4" />
            <div className="h-3 bg-slate-50 rounded w-1/2" />
          </div>
          <div className="h-8 w-24 bg-slate-100 rounded-full" />
        </div>
      ))}
    </div>
  );
}