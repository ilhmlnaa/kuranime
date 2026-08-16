import { Link } from 'react-router-dom';
import { Play, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!data?.carousel || data.carousel.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % data.carousel.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [data?.carousel]);

  if (isLoading) return <HomePageSkeleton />;
  if (error) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!data) return null;

  const carouselItems = data.carousel ?? [];
  const heroAnime = carouselItems[activeIndex] || data.recent?.[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? carouselItems.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % carouselItems.length);
  };

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* Hero Section */}
      {heroAnime && (
        <section className="relative w-full h-[56vh] min-h-[360px] md:h-[72vh] overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-t from-[#070a10] via-[#070a10]/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-linear-to-r from-[#070a10] via-[#070a10]/30 to-transparent z-10 w-2/3" />
          
          <AnimatePresence mode="popLayout">
            <motion.div
              key={heroAnime.slug}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={heroAnime.img}
                alt={heroAnime.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-0 left-0 right-0 px-4 py-8 md:px-8 md:py-12 z-20 flex flex-col gap-4 max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={heroAnime.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#00a3ff]" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#00a3ff]">Featured</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight line-clamp-2">
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
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-semibold border border-white/20 transition-all text-sm backdrop-blur-md"
                  >
                    Detail Info
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Navigation Controls */}
          {carouselItems.length > 1 && (
            <div className="absolute bottom-6 right-4 md:bottom-8 md:right-8 z-30 flex flex-col items-end gap-3">
              {/* Arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-[#00a3ff] hover:text-white border border-white/10"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-[#00a3ff] hover:text-white border border-white/10"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              
              {/* Dots */}
              <div className="flex items-center gap-2 bg-black/30 px-3 py-2 rounded-full backdrop-blur-md border border-white/5">
                {carouselItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeIndex 
                        ? 'w-6 bg-[#00a3ff] shadow-[0_0_8px_rgba(0,163,255,0.8)]' 
                        : 'w-1.5 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
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
