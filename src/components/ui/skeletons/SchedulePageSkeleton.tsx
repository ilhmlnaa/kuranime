export const SchedulePageSkeleton = () => {
  return (
    <div className="px-4 md:px-8 py-6 space-y-6 animate-pulse">
      {/* Header bar */}
      <div className="h-8 w-52 bg-[#111827] rounded-xl ring-1 ring-white/[0.04]" />

      {/* 7 day tabs */}
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-10 min-w-24 flex-1 bg-[#111827] rounded-xl ring-1 ring-white/[0.04]"
          />
        ))}
      </div>

      {/* 6 schedule rows */}
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-20 flex items-center gap-4 bg-[#111827] rounded-2xl ring-1 ring-white/[0.04] p-3"
          >
            <div className="h-14 w-11 flex-shrink-0 bg-[#0d1117] rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/5 bg-[#0d1117] rounded-md" />
              <div className="h-3 w-1/4 bg-[#0d1117] rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
