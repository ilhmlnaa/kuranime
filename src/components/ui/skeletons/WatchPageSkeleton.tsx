export const WatchPageSkeleton = () => {
  return (
    <div className="px-4 md:px-8 py-6 space-y-6 animate-pulse max-w-screen-2xl mx-auto">
      {/* Top Grid: Player (col-span-3) + Server List (col-span-1) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Player + Nav Bar */}
        <div className="lg:col-span-3 space-y-4">
          <div className="w-full aspect-video bg-[#111827] rounded-2xl ring-1 ring-white/[0.04]" />
          <div className="h-16 w-full bg-[#111827] rounded-2xl ring-1 ring-white/[0.04]" />
        </div>

        {/* Server Selector Sidebar */}
        <div className="lg:col-span-1 space-y-3 bg-[#111827] p-5 rounded-2xl ring-1 ring-white/[0.04]">
          <div className="h-5 w-28 bg-slate-800/60 rounded-lg" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-11 w-full bg-slate-800/40 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Bottom Grid: Download (col-span-3) + All Episodes (col-span-1) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-3 bg-[#111827] p-5 rounded-2xl ring-1 ring-white/[0.04]">
          <div className="h-5 w-32 bg-slate-800/60 rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
            <div className="h-28 bg-slate-800/40 rounded-xl" />
            <div className="h-28 bg-slate-800/40 rounded-xl" />
            <div className="h-28 bg-slate-800/40 rounded-xl" />
          </div>
        </div>
        <div className="lg:col-span-1 space-y-3 bg-[#111827] p-5 rounded-2xl ring-1 ring-white/[0.04]">
          <div className="h-5 w-28 bg-slate-800/60 rounded-lg" />
          <div className="grid grid-cols-4 gap-2 pt-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 bg-slate-800/40 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
