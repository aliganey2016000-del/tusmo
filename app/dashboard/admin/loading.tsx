export default function Loading() {
  return (
    <div className="animate-pulse space-y-10">
      
      {/* 1. Page Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-200 rounded-xl" />
          <div className="h-4 w-64 bg-slate-100 rounded-lg" />
        </div>
        <div className="h-11 w-36 bg-slate-200 rounded-2xl hidden md:block" />
      </div>

      {/* 2. Stats Grid Skeleton (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className="h-12 w-12 bg-slate-100 rounded-2xl" />
              <div className="h-4 w-12 bg-slate-50 rounded-lg" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-20 bg-slate-100 rounded-md" />
              <div className="h-7 w-24 bg-slate-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* 3. Main Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Table or Main Chart Placeholder (Larger) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-[500px]">
            <div className="flex items-center justify-between mb-8">
              <div className="h-6 w-32 bg-slate-100 rounded-lg" />
              <div className="h-6 w-24 bg-slate-50 rounded-lg" />
            </div>
            <div className="space-y-4">
               {[...Array(6)].map((_, i) => (
                 <div key={i} className="h-12 w-full bg-slate-50 rounded-2xl" />
               ))}
            </div>
          </div>
        </div>

        {/* Right Side: Recent Activity or Calendar Placeholder (Smaller) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-[500px] space-y-6">
            <div className="h-6 w-40 bg-slate-100 rounded-lg" />
            <div className="space-y-6">
               {[...Array(5)].map((_, i) => (
                 <div key={i} className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-slate-100 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-full bg-slate-100 rounded-md" />
                      <div className="h-3 w-2/3 bg-slate-50 rounded-md" />
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}