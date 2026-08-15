import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Filter } from 'lucide-react';
import { useAnimeList, useAnimeSearch } from '../hooks/useAnime';
import { AnimeListSkeleton } from '../components/ui/skeletons';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { AnimeCard } from '../components/ui/AnimeCard';
import { Pagination } from '../components/ui/Pagination';

export default function AnimeListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const page = Number(searchParams.get('page') ?? 1);

  const [inputVal, setInputVal] = useState<string | null>(null);
  const inputValue = inputVal ?? query;

  const isSearching = query.length > 0;

  const listResult = useAnimeList({ page }, { enabled: !isSearching });
  const searchResult = useAnimeSearch(query, { enabled: isSearching });

  const { data, isLoading, error, refetch } = isSearching ? searchResult : listResult;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (inputValue.trim()) {
      newParams.set('q', inputValue.trim());
    } else {
      newParams.delete('q');
    }
    newParams.delete('page');
    setInputVal(null);
    setSearchParams(newParams);
  };

  const clearSearch = () => {
    setInputVal('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('q');
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const setPage = (p: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(p));
    setSearchParams(newParams);
  };

  const results = data?.results ?? [];

  return (
    <div className="px-4 md:px-8 py-8 pb-16 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <span className="w-1.5 h-7 bg-[#00a3ff] rounded-full inline-block" />
          {isSearching ? `Hasil: "${query}"` : 'Daftar Anime'}
        </h1>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Cari anime..."
              className="bg-[#121620] border border-white/10 rounded-xl pl-9 pr-9 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-[#00a3ff]/50 w-full sm:w-52 transition-colors"
            />
            {inputValue && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="flex items-center gap-1.5 bg-[#00a3ff] hover:bg-[#00a3ff]/90 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
            Cari
          </button>
        </form>
      </div>

      {/* Content */}
      {isLoading ? (
        <AnimeListSkeleton />
      ) : error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : results.length === 0 ? (
        <EmptyState
          title="Anime tidak ditemukan"
          description={isSearching ? `Tidak ada hasil untuk "${query}"` : 'Belum ada anime tersedia.'}
        />
      ) : (
        <>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
            {results.map((anime) => (
              <AnimeCard
                key={anime.id}
                id={anime.id}
                slug={anime.slug}
                title={anime.title}
              />
            ))}
          </div>

          {!isSearching && (
            <Pagination currentPage={page} totalPages={100} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}
