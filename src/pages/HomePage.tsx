import { Link } from 'react-router-dom';
import { Play, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHome } from '../hooks/useAnime';
import { HomePageSkeleton } from '../components/ui/skeletons';
import { ErrorState } from '../components/ui/ErrorState';
import { SectionHeader } from '../components/ui/SectionHeader';
import { AnimeCard } from '../components/ui/AnimeCard';
import { Image } from '../components/ui/Image';

function getAnimeId(url?: string): string {
  if (!url) return '';
  const match = url.match(/\/anime\/(\d+)/);
  return match?.[1] ?? '';
}

export default function HomePage() {
  const { data, isLoading, error, refetch } = useHome();

  if (isLoading) return <HomePageSkeleton />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!data) return null;

  const heroAnime = data.carousel?.[0];

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Hero Section */}
      {heroAnime && (
        <section className="relative w-full h-[56vh] min-h-[360px] md:h-[72vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-[#0b0e14]/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b0e14] via-[#0b0e14]/30 to-transparent z-10 w-2/3" />
          <Image
            src={heroAnime.img}
            alt={heroAnime.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 px-4 py-8 md:px-8 md:py-12 z-20 flex flex-col gap-4 max-w-3xl">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00a3ff]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#00a3ff]">Featured</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight">
              {heroAnime.title}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <Link
                to={`/anime/${getAnimeId(heroAnime.url)}/${heroAnime.slug}`}
                className="flex items-center gap-2 bg-[#00a3ff] hover:bg-[#00a3ff]/90 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(0,163,255,0.3)] hover:shadow-[0_0_28px_rgba(0,163,255,0.45)] text-sm"
              >
                <Play className="w-4 h-4 fill-current" />
                Nonton Sekarang
              </Link>
              <Link
                to={`/anime/${getAnimeId(heroAnime.url)}/${heroAnime.slug}`}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-semibold border border-white/20 transition-all text-sm"
              >
                Detail Info
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Recent Section */}
      <div className="px-4 md:px-8">
        <SectionHeader title="Rilis Terbaru" to="/anime" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4 mt-6">
          {data.recent?.map((anime, i) => (
            <motion.div
              key={anime.slug}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <AnimeCard
                id={getAnimeId(anime.url)}
                slug={anime.slug}
                title={anime.title}
                cover={anime.img}
                badge={anime.episode ? String(anime.episode) : undefined}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Carousel / Popular Section */}
      {data.carousel && data.carousel.length > 1 && (
        <div className="px-4 md:px-8">
          <SectionHeader title="Pilihan Editor" to="/anime" />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4 mt-6">
            {data.carousel.slice(1).map((anime, i) => (
              <motion.div
                key={anime.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 + 0.15, duration: 0.3 }}
              >
                <AnimeCard
                  id={getAnimeId(anime.url)}
                  slug={anime.slug}
                  title={anime.title}
                  cover={anime.img}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
