export const AnimeDetailSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse pb-16">
      {/* Banner */}
      <div className="w-full h-[38vh] md:h-[48vh] bg-[#111827] ring-1 ring-white/[0.04]" />

      <div className="px-4 md:px-8 max-w-[1920px] mx-auto -mt-32 relative z-10 space-y-8">
        {/* Poster & Info */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-[180px] aspect-[3/4] flex-shrink-0 bg-[#111827] rounded-2xl ring-1 ring-white/[0.04]" />

          <div className="flex-1 space-y-4">
            <div className="h-8 w-3/4 bg-[#111827] rounded-xl ring-1 ring-white/[0.04]" />
            <div className="h-5 w-1/2 bg-[#111827] rounded-xl ring-1 ring-white/[0.04]" />
            <div className="h-4 w-1/3 bg-[#111827] rounded-xl ring-1 ring-white/[0.04]" />

            {/* 4 Tags */}
            <div className="flex gap-2 pt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-7 w-16 bg-[#0d1117] rounded-lg ring-1 ring-white/[0.04]" />
              ))}
            </div>

            {/* Synopsis 5 lines */}
            <div className="space-y-2 pt-3">
              <div className="h-3.5 w-full bg-[#0d1117] rounded-md" />
              <div className="h-3.5 w-11/12 bg-[#0d1117] rounded-md" />
              <div className="h-3.5 w-4/5 bg-[#0d1117] rounded-md" />
              <div className="h-3.5 w-5/6 bg-[#0d1117] rounded-md" />
              <div className="h-3.5 w-2/3 bg-[#0d1117] rounded-md" />
            </div>
          </div>
        </div>

        {/* Episodes Grid 3x4 (12 items) */}
        <div className="space-y-4">
          <div className="h-6 w-32 bg-[#111827] rounded-xl ring-1 ring-white/[0.04]" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-12 bg-[#111827] rounded-xl ring-1 ring-white/[0.04]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
