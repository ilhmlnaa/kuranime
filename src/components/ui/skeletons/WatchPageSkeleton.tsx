export const WatchPageSkeleton = () => {
  return (
    <div className="px-4 md:px-8 py-6 space-y-6 animate-pulse">
      {/* Nav bar */}
      <div className="h-14 w-full bg-[#111827] rounded-2xl ring-1 ring-white/[0.04]" />

      {/* Player area */}
      <div className="w-full aspect-video bg-[#111827] rounded-2xl ring-1 ring-white/[0.04]" />

      {/* Grid 1:2 — server selector + download area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Server selector — 4 buttons */}
        <div className="space-y-3">
          <div className="h-5 w-28 bg-[#111827] rounded-lg ring-1 ring-white/[0.04]" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 w-full bg-[#111827] rounded-xl ring-1 ring-white/[0.04]" />
          ))}
        </div>

        {/* Download area — 2 cards */}
        <div className="md:col-span-2 space-y-4">
          <div className="h-5 w-28 bg-[#111827] rounded-lg ring-1 ring-white/[0.04]" />
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-24 w-full bg-[#111827] rounded-2xl ring-1 ring-white/[0.04]"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
