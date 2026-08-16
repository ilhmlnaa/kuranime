import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, List, Radio, Download, ExternalLink } from 'lucide-react';
import { useAnimeDetail, useEpisode, useStream } from '../hooks/useAnime';
import { useHistoryStore } from '../store/useHistoryStore';
import { VideoPlayer } from '../components/ui/VideoPlayer';
import { WatchPageSkeleton } from '../components/ui/skeletons';
import { ErrorState } from '../components/ui/ErrorState';
import type { DownloadQuality } from '../types';

export default function WatchPage() {
  const { id, ep } = useParams<{ id: string; ep: string }>();
  const [selectedServer, setSelectedServer] = useState<string | null>(null);

  const { data: anime } = useAnimeDetail(id);
  const { data: episodeData, isLoading: isEpLoading, error } = useEpisode(id, ep);

  const servers = (episodeData?.servers ?? []) as Array<{ id?: string; name?: string; label?: string }>;
  const defaultStreamUrl = episodeData?.streamUrl as string | undefined;
  const downloads = (episodeData?.downloads ?? []) as DownloadQuality[];
  
  const activeServer = selectedServer ?? (defaultStreamUrl ? 'kuramadrive' : servers[0]?.id);
  const isKuramaDrive = activeServer === 'kuramadrive' || activeServer === 'kdrive';

  const shouldFetchStream = Boolean(id && ep && activeServer && !(activeServer === 'kuramadrive' && defaultStreamUrl));
  const { data: streamData, isLoading: isStreamLoading } = useStream(
    id,
    ep,
    activeServer,
    { enabled: shouldFetchStream }
  );

  const addHistory = useHistoryStore((s) => s.add);

  // Save to history (depend strictly on episodeData to avoid empty history if anime detail fails)
  useEffect(() => {
    if (episodeData) {
      addHistory({
        animeId: id ?? episodeData.animeId,
        slug: episodeData.slug ?? anime?.slug ?? '',
        title: episodeData.animeTitle || anime?.title || 'Unknown Anime',
        animeTitle: episodeData.animeTitle || anime?.title || 'Unknown Anime',
        episode: episodeData.episode || ep || 1,
        cover: (anime?.cover as string | undefined) ?? '',
      });
    }
  }, [episodeData, anime, id, ep, addHistory]);

  if (isEpLoading) return <WatchPageSkeleton />;
  if (error || !episodeData) return <ErrorState message={error?.message ?? 'Gagal memuat episode'} />;

  // -- Navigation: prefer API-provided navigation object, fallback to episode list scan --
  const navPrev = episodeData.navigation?.prev;
  const navNext = episodeData.navigation?.next;

  // Fallback: scan anime episode list sorted by number
  const rawEpisodes = (anime?.episodes ?? []) as Array<{ episode: string | number; title?: string }>;
  const sortedEpisodes = [...rawEpisodes].sort((a, b) => Number(a.episode) - Number(b.episode));
  const currentIndex = sortedEpisodes.findIndex(e => String(e.episode) === String(ep));
  const listPrev = currentIndex > 0 ? sortedEpisodes[currentIndex - 1] : undefined;
  const listNext = currentIndex !== -1 && currentIndex < sortedEpisodes.length - 1 ? sortedEpisodes[currentIndex + 1] : undefined;

  // Use API navigation.prev/next first, fall back to episode list
  const prevEpNum = navPrev?.episode ?? listPrev?.episode;
  const nextEpNum = navNext?.episode ?? listNext?.episode;

  // Slug for back-to-detail link: episodeData.slug > anime.slug > id as fallback
  const animeSlug = episodeData.slug ?? anime?.slug ?? '';
  const backToDetailUrl = animeSlug ? `/anime/${id}/${animeSlug}` : `/anime/${id}`;

  const videoUrl = activeServer === 'kuramadrive' && defaultStreamUrl ? defaultStreamUrl : streamData?.videoUrl as string | undefined;
  const iframeUrl = streamData?.iframeUrl as string | undefined;

  return (
    <div className="flex flex-col gap-6 px-4 md:px-8 py-6 max-w-screen-2xl mx-auto pb-16">
      
      {/* Top Grid: Player (Left) + Server Selection (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Column: Player & Info */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <VideoPlayer
            key={`${activeServer}-${videoUrl ?? iframeUrl ?? 'none'}`}
            videoUrl={isKuramaDrive ? videoUrl : undefined}
            iframeUrl={!isKuramaDrive ? (iframeUrl ?? videoUrl) : undefined}
            title={anime ? `${anime.title} · Episode ${ep}` : `Episode ${ep}`}
            poster={anime?.cover as string | undefined}
            activeServerId={activeServer}
            isLoading={isStreamLoading}
          />

          {/* Episode Info & Navigation */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111620] p-4 sm:p-5 rounded-2xl border border-[#00a3ff]/10 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
            <div>
              <Link to={backToDetailUrl} className="text-[#00a3ff] hover:underline font-semibold text-sm drop-shadow-sm">
                {episodeData.animeTitle || anime?.title || 'Anime Details'}
              </Link>
              <h1 className="text-white text-xl sm:text-2xl font-bold mt-1 tracking-tight">
                {episodeData.title || `Episode ${ep}`}
              </h1>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <NavBtn to={prevEpNum ? `/anime/${id}/episode/${prevEpNum}` : undefined} label="Episode Sebelumnya" icon={<ChevronLeft className="w-5 h-5" />} text="Prev" />
              <NavBtn to={backToDetailUrl} label="Daftar Episode" icon={<List className="w-5 h-5" />} />
              <NavBtn to={nextEpNum ? `/anime/${id}/episode/${nextEpNum}` : undefined} label="Episode Selanjutnya" icon={<ChevronRight className="w-5 h-5" />} text="Next" reverse />
            </div>
          </div>
        </div>

        {/* Right Column: Server Selector */}
        <div className="lg:col-span-1 bg-[#111620] border border-white/5 rounded-2xl p-5 shadow-lg sticky top-24">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
            <Radio className="w-4 h-4 text-[#00a3ff]" />
            <h3 className="font-semibold text-slate-200 text-sm tracking-wide">Server Streaming</h3>
          </div>
          {servers.length > 0 || defaultStreamUrl ? (
            <div className="flex flex-col gap-2.5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {defaultStreamUrl && !servers.some(s => s.id === 'kuramadrive') && (
                 <ServerBtn 
                   isActive={activeServer === 'kuramadrive'} 
                   onClick={() => setSelectedServer('kuramadrive')}
                   label="Kuramadrive (Default)"
                 />
              )}
              {servers.map((server) => {
                const serverId = server.id ?? '';
                const serverLabel = server.label ?? server.name ?? serverId;
                return (
                  <ServerBtn 
                    key={serverId}
                    isActive={activeServer === serverId}
                    onClick={() => setSelectedServer(serverId)}
                    label={serverLabel}
                  />
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-sm bg-black/20 rounded-xl border border-white/5">
              Tidak ada server alternatif.
            </div>
          )}
        </div>
      </div>

      {/* Bottom Grid: All Episodes & Downloads */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start mt-2">
        
        {/* Left/Main: Download Section (Span 3 to align with Player) */}
        <div className="bg-[#111620] border border-white/5 rounded-2xl p-5 lg:col-span-3 shadow-lg">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
            <Download className="w-4 h-4 text-[#00a3ff]" />
            <h3 className="font-semibold text-slate-200 text-sm tracking-wide">Download Episode {ep}</h3>
          </div>
          
          {downloads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {downloads.map((dl, i) => (
                <div key={i} className="bg-[#0b0e14] border border-white/[0.04] rounded-xl p-3.5 hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/[0.04]">
                    <span className="font-bold text-[#00a3ff] text-xs uppercase tracking-widest">{dl.quality}</span>
                    <span className="text-xs text-slate-500 font-medium px-2 py-0.5 bg-white/5 rounded-md">{dl.size}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {dl.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1f2e] hover:bg-[#00a3ff] text-slate-300 hover:text-white transition-all text-xs font-semibold border border-white/5 hover:border-transparent group shadow-sm"
                      >
                        {link.name}
                        <ExternalLink className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-[#0b0e14]/50 rounded-xl border border-white/[0.02]">
              <Download className="w-8 h-8 text-slate-700 mb-3" />
              <p className="text-slate-400 text-sm font-medium">Link download belum tersedia untuk episode ini.</p>
            </div>
          )}
        </div>
        
        {/* Right: All Episodes List (Span 1) */}
        {sortedEpisodes.length > 0 && (
          <div className="bg-[#111620] border border-white/5 rounded-2xl p-5 shadow-lg lg:col-span-1">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
              <List className="w-4 h-4 text-[#00a3ff]" />
              <h3 className="font-semibold text-slate-200 text-sm tracking-wide">Semua Episode</h3>
              <span className="ml-auto text-xs font-medium text-slate-500 bg-white/5 px-2 py-0.5 rounded-md">{sortedEpisodes.length} Ep</span>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-5 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {sortedEpisodes.map((episodeItem) => {
                const isCurrent = String(episodeItem.episode) === String(ep);
                return (
                  <Link
                    key={episodeItem.episode}
                    to={`/anime/${id}/episode/${episodeItem.episode}`}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all border ${
                      isCurrent 
                        ? 'bg-[#00a3ff]/15 border-[#00a3ff]/50 text-[#00a3ff] shadow-[0_0_12px_rgba(0,163,255,0.1)] pointer-events-none' 
                        : 'bg-[#0b0e14] border-white/[0.04] text-slate-400 hover:bg-[#1a1f2e] hover:border-white/10 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-base font-bold">{episodeItem.episode}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ServerBtn({ isActive, onClick, label }: { isActive: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-3 rounded-xl text-left text-sm font-medium transition-all border overflow-hidden group ${
        isActive
          ? 'bg-gradient-to-r from-[#00a3ff]/15 to-transparent border-[#00a3ff]/40 text-[#00a3ff] shadow-[0_0_16px_rgba(0,163,255,0.15)]'
          : 'bg-[#0b0e14] border-white/5 text-slate-400 hover:text-slate-200 hover:bg-[#1a1f2e] hover:border-white/10'
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-0 bottom-0 w-1 bg-[#00a3ff] shadow-[0_0_8px_rgba(0,163,255,0.8)]" />
      )}
      <span className={isActive ? 'pl-1' : ''}>{label}</span>
    </button>
  );
}

function NavBtn({ to, label, icon, text, reverse }: { to?: string; label: string; icon: React.ReactNode; text?: string; reverse?: boolean }) {
  const disabled = !to;
  return (
    <Link
      to={to ?? '#'}
      aria-disabled={disabled}
      className={`flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border transition-all ${
        disabled
          ? 'border-white/5 bg-[#0b0e14]/50 text-slate-600 pointer-events-none'
          : 'border-white/10 bg-[#0b0e14] hover:bg-[#1a1f2e] hover:border-white/20 text-slate-200 shadow-sm'
      }`}
      title={label}
    >
      {reverse && text && <span className="hidden sm:block text-xs font-bold uppercase tracking-wider">{text}</span>}
      {icon}
      {!reverse && text && <span className="hidden sm:block text-xs font-bold uppercase tracking-wider">{text}</span>}
    </Link>
  );
}
