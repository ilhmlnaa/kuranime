import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Play, Trash2 } from 'lucide-react';
import { useSchedule } from '../hooks/useAnime';
import type { ScheduleDay, ScheduleItem } from '../types';
import { SkeletonGrid } from '../components/ui/SkeletonGrid';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';

const DAYS = [
  { key: 'monday', label: 'Senin' },
  { key: 'tuesday', label: 'Selasa' },
  { key: 'wednesday', label: 'Rabu' },
  { key: 'thursday', label: 'Kamis' },
  { key: 'friday', label: 'Jumat' },
  { key: 'saturday', label: 'Sabtu' },
  { key: 'sunday', label: 'Minggu' },
];

const TODAY_INDEX = new Date().getDay();
// getDay(): 0=Sun, 1=Mon, ..., 6=Sat
const TODAY_KEY = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][TODAY_INDEX];

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState(TODAY_KEY);
  const { data, isLoading, error, refetch } = useSchedule(activeDay);

  const scheduleDay = data as ScheduleDay | undefined;
  const scheduleItems: ScheduleItem[] = scheduleDay?.schedule ?? [];

  return (
    <div className="px-4 md:px-8 py-8 pb-16 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
          <span className="w-1.5 h-7 bg-gradient-to-b from-[#38bdf8] to-[#0284c7] rounded-full inline-block" />
          Jadwal Tayang
        </h1>
        <p className="text-slate-500 mt-1.5 text-sm">Jadwal rilis episode per hari</p>
      </div>

      {/* Day Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {DAYS.map((day) => (
          <button
            key={day.key}
            onClick={() => setActiveDay(day.key)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              activeDay === day.key
                ? 'bg-gradient-to-r from-[#00a3ff]/15 to-[#0284c7]/10 border-[#00a3ff]/40 text-[#38bdf8]'
                : 'bg-[#121620] border-white/10 text-slate-400 hover:text-slate-200 hover:bg-[#1e2635]'
            } ${day.key === TODAY_KEY ? 'ring-1 ring-[#00a3ff]/30' : ''}`}>
            {day.label}
            {day.key === TODAY_KEY && (
              <span className="ml-1.5 text-[10px] font-semibold text-[#38bdf8]">Hari Ini</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <SkeletonGrid count={8} variant="row" />
      ) : error ? (
        <ErrorState message={error.message} onRetry={refetch} />
      ) : scheduleItems.length === 0 ? (
        <EmptyState title="Tidak ada jadwal" description="Tidak ada anime yang tayang pada hari ini." />
      ) : (
        <div className="flex flex-col gap-3">
          {scheduleItems.map((anime) => (
            <Link
              key={anime.id}
              to={`/anime/${anime.id}`}
              className="flex items-center gap-4 bg-[#121620] hover:bg-[#1e2635] border border-white/10 rounded-2xl p-3.5 transition-colors group"
            >
              <div className="flex-shrink-0 w-14 h-20 md:w-16 md:h-24 rounded-xl overflow-hidden bg-[#0b0e14] border border-white/10">
                {anime.img && (
                  <img src={anime.img} alt={anime.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-grow min-w-0">
                <div className="text-white font-semibold text-sm md:text-base line-clamp-2 group-hover:text-[#00a3ff] transition-colors">
                  {anime.title}
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-[#38bdf8] text-xs font-medium">
                    <Play className="w-3 h-3 fill-current" />
                    Ep {anime.episode}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 text-xs">
                    <Clock className="w-3 h-3" />
                    {anime.airTime}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 text-slate-600 group-hover:text-slate-400 transition-colors">
                <Play className="w-5 h-5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export { Trash2 };
