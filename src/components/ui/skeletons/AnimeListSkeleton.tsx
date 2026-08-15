export const AnimeListSkeleton = () => {
  return (
    <div className="px-4 md:px-8 py-6 space-y-6 animate-pulse">
      {/* Header bar + search bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="h-8 w-48 bg-[#111827] rounded-xl ring-1 ring-white/[0.04]" />
        <div className="h-10 w-full md:w-64 bg-[#111827] rounded-xl ring-1 ring-white/[0.04]" />
      </div>

      {/* Grid 7 columns, 21 items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-7 gap-4">
        {Array.from({ length: 21 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col bg-[#111827] rounded-xl ring-1 ring-white/[0.04] p-2 space-y-3"
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
  );
};
