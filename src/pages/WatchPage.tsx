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
  
  // Default server handling:
  // If 'streamUrl' is present, it means Kuramadrive is available directly without fetching stream endpoint
  const activeServer = selectedServer ?? (defaultStreamUrl ? 'kuramadrive' : servers[0]?.id);
  const isKuramaDrive = activeServer === 'kuramadrive' || activeServer === 'kdrive';

  // Only fetch stream URL if the user selects a DIFFERENT server (not the default streamUrl)
  const shouldFetchStream = Boolean(id && ep && activeServer && !(activeServer === 'kuramadrive' && defaultStreamUrl));
  const { data: streamData, isLoading: isStreamLoading } = useStream(
    id,
    ep,
    activeServer,
    { enabled: shouldFetchStream }
  );

  const addHistory = useHistoryStore((s) => s.add);

  // Save to history
  useEffect(() => {
    if (anime && episodeData) {
      addHistory({
        animeId: anime.id,
        slug: anime.slug,
        title: anime.title,
        animeTitle: anime.title,
        episode: episodeData.episode,
        cover: anime.cover as string | undefined,
      });
    }
  }, [anime, episodeData, addHistory]);

  if (isEpLoading) return <WatchPageSkeleton />;
  if (error || !episodeData) return <ErrorState message={error?.message ?? 'Gagal memuat episode'} />;

  const episodesList = (anime?.episodes ?? []) as Array<{ episode: number }>;
  const currentEpNum = Number(ep);
  const prevEp = episodesList.find((e) => e.episode === currentEpNum - 1);
  const nextEp = episodesList.find((e) => e.episode === currentEpNum + 1);

  const videoUrl = activeServer === 'kuramadrive' && defaultStreamUrl ? defaultStreamUrl : streamData?.videoUrl as string | undefined;
  const iframeUrl = streamData?.iframeUrl as string | undefined;

  return (
    <div className="flex flex-col gap-5 px-4 md:px-8 py-6 max-w-screen-2xl mx-auto pb-16">
      {/* Episode Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#121620] p-4 rounded-2xl border border-white/10">
        <div>
          {anime && (
            <Link to={`/anime/${anime.id}/${anime.slug}`} className="text-[#00a3ff] hover:underline font-semibold text-sm">
              {anime.title}
            </Link>
          )}
          <div className="text-white text-lg font-bold mt-0.5">
            {episodeData.title || `Episode ${ep}`}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <NavBtn to={prevEp ? `/anime/${id}/episode/${prevEp.episode}` : undefined} label="Episode Sebelumnya">
            <ChevronLeft className="w-5 h-5" />
          </NavBtn>
          <NavBtn to={`/anime/${id}`} label="Daftar Episode">
            <List className="w-5 h-5" />
          </NavBtn>
          <NavBtn to={nextEp ? `/anime/${id}/episode/${nextEp.episode}` : undefined} label="Episode Selanjutnya">
            <ChevronRight className="w-5 h-5" />
          </NavBtn>
        </div>
      </div>

      {/* Player Container (pembungkus utama) */}
      <VideoPlayer
        videoUrl={isKuramaDrive ? videoUrl : undefined}
        iframeUrl={!isKuramaDrive ? (iframeUrl ?? videoUrl) : undefined}
        title={anime ? `${anime.title} · Episode ${ep}` : `Episode ${ep}`}
        poster={anime?.cover as string | undefined}
        activeServerId={activeServer}
        isLoading={isStreamLoading}
      />

      {/* Grid Server & Download */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Server Selector (Kiri) */}
        <div className="bg-[#121620] border border-white/10 rounded-2xl p-5 lg:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <Radio className="w-4 h-4 text-[#00a3ff]" />
            <h3 className="font-semibold text-slate-200 text-sm">Pilih Server Streaming</h3>
          </div>
          {servers.length > 0 ? (
            <div className="flex flex-col gap-2">
              {/* Force Kuramadrive to be explicitly selectable if we have streamUrl */}
              {defaultStreamUrl && !servers.some(s => s.id === 'kuramadrive') && (
                 <button
                 onClick={() => setSelectedServer('kuramadrive')}
                 className={`relative px-4 py-3 rounded-xl text-left text-sm font-medium transition-all border ${
                   activeServer === 'kuramadrive'
                     ? 'bg-[#00a3ff]/10 border-[#00a3ff]/40 text-[#00a3ff] shadow-[0_0_16px_rgba(0,163,255,0.15)]'
                     : 'bg-[#0b0e14] border-white/10 text-slate-400 hover:text-slate-200 hover:bg-[#1a1f2e] hover:border-white/15'
                 }`}
               >
                 {activeServer === 'kuramadrive' && (
                   <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                     <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00a3ff] opacity-60" />
                     <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#00a3ff]" />
                   </span>
                 )}
                 Kuramadrive (Default)
               </button>
              )}

              {servers.map((server) => {
                const serverId = server.id ?? '';
                const serverLabel = server.label ?? server.name ?? serverId;
                const isCurrent = activeServer === serverId;
                return (
                  <button
                    key={serverId}
                    onClick={() => setSelectedServer(serverId)}
                    className={`relative px-4 py-3 rounded-xl text-left text-sm font-medium transition-all border ${
                      isCurrent
                        ? 'bg-[#00a3ff]/10 border-[#00a3ff]/40 text-[#00a3ff] shadow-[0_0_16px_rgba(0,163,255,0.15)]'
                        : 'bg-[#0b0e14] border-white/10 text-slate-400 hover:text-slate-200 hover:bg-[#1a1f2e] hover:border-white/15'
                    }`}
                  >
                    {isCurrent && (
                      <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00a3ff] opacity-60" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#00a3ff]" />
                      </span>
                    )}
                    {serverLabel}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Tidak ada server alternatif.</p>
          )}
        </div>

        {/* Download Section (Kanan) */}
        <div className="bg-[#121620] border border-white/10 rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/5">
            <Download className="w-4 h-4 text-[#38bdf8]" />
            <h3 className="font-semibold text-slate-200 text-sm">Download Episode</h3>
          </div>
          
          {downloads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {downloads.map((dl, i) => (
                <div key={i} className="bg-[#0b0e14] border border-white/5 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/5">
                    <span className="font-semibold text-[#00a3ff] text-xs uppercase tracking-wider">{dl.quality}</span>
                    <span className="text-xs text-slate-500 font-medium">{dl.size}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {dl.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1f2e] hover:bg-[#00a3ff] text-slate-300 hover:text-white transition-colors text-xs font-medium border border-white/5 hover:border-transparent group"
                      >
                        {link.name}
                        <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Download className="w-8 h-8 text-slate-700 mb-2" />
              <p className="text-slate-500 text-sm">Link download belum tersedia untuk episode ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NavBtn({ to, label, children }: { to?: string; label: string; children: React.ReactNode }) {
  const disabled = !to;
  return (
    <Link
      to={to ?? '#'}
      aria-disabled={disabled}
      className={`p-2 rounded-xl border transition-colors ${
        disabled
          ? 'border-white/5 bg-[#0b0e14] text-slate-600 pointer-events-none'
          : 'border-white/10 bg-[#0b0e14] hover:bg-[#1e2635] text-white'
      }`}
      title={label}
    >
      {children}
    </Link>
  );
}
