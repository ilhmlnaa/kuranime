export const HomePageSkeleton = () => {
  return (
    <div className="px-4 md:px-8 py-6 space-y-12 animate-pulse">
      {/* Hero placeholder */}
      <div className="w-full aspect-[21/9] bg-[#111827] rounded-2xl ring-1 ring-white/[0.04]" />

      {/* Section placeholder */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-7 w-48 bg-[#111827] rounded-xl ring-1 ring-white/[0.04]" />
          <div className="h-5 w-20 bg-[#111827] rounded-lg ring-1 ring-white/[0.04]" />
        </div>

        {/* Grid 6 cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col bg-[#111827] rounded-xl overflow-hidden ring-1 ring-white/[0.04] p-2 space-y-3"
            >
              <div className="aspect-[3/4] w-full bg-[#0d1117] rounded-lg" />
              <div className="space-y-2 p-1">
                <div className="h-4 w-5/6 bg-[#0d1117] rounded-md" />
                <div className="h-3 w-1/2 bg-[#0d1117] rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
