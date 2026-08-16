export const WatchPageSkeleton = () => {
  return (
    <div className="pb-16 relative w-full">
      {/* Background Banner Skeleton */}
      <div className="absolute top-0 left-0 right-0 h-[40vh] md:h-[50vh] w-full pointer-events-none z-0">
        <div className="absolute inset-0 bg-linear-to-t from-[#070a10] via-[#070a10]/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-[#070a10]/50 animate-pulse" />
      </div>

      <div className="relative z-10 px-4 md:px-8 py-6 space-y-6 animate-pulse max-w-[1920px] mx-auto">
        {/* Breadcrumbs Skeleton */}
        <div className="h-8 w-64 bg-slate-800/60 rounded-xl mb-2" />

        {/* Top Grid: Player (col-span-3) + Server List (col-span-1) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* Player + Nav Bar */}
          <div className="lg:col-span-3 space-y-4">
            <div className="w-full aspect-video bg-[#090b10] rounded-2xl ring-1 ring-white/[0.04]" />
            <div className="h-16 w-full bg-[#111620] rounded-2xl ring-1 ring-white/[0.04]" />
          </div>

          {/* Server Selector + Episodes Sidebar */}
          <div className="space-y-6 lg:col-span-1 lg:sticky lg:top-24">
            <div className="space-y-3 rounded-2xl bg-[#111620] p-5 ring-1 ring-white/[0.04]">
              <div className="h-5 w-28 rounded-lg bg-slate-800/60" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-11 w-full rounded-xl bg-slate-800/40" />
              ))}
            </div>
            <div className="space-y-3 rounded-2xl bg-[#111620] p-5 ring-1 ring-white/[0.04]">
              <div className="h-5 w-28 rounded-lg bg-slate-800/60" />
              <div className="grid grid-cols-4 gap-2 pt-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-10 rounded-xl bg-slate-800/40" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Download section aligned with the player column */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start mt-2">
          <div className="lg:col-span-3 space-y-3 bg-[#111620] p-5 rounded-2xl ring-1 ring-white/[0.04]">
            <div className="h-5 w-32 bg-slate-800/60 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              <div className="h-28 bg-slate-800/40 rounded-xl" />
              <div className="h-28 bg-slate-800/40 rounded-xl" />
              <div className="h-28 bg-slate-800/40 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
