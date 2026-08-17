import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, List, Radio, Download, ExternalLink, SkipForward } from 'lucide-react';
import { useAnimeDetail, useEpisode, useStream } from '../hooks/useAnime';
import { useHistoryStore } from '../store/useHistoryStore';
import { VideoPlayer } from '../components/ui/VideoPlayer';
import { WatchPageSkeleton } from '../components/ui/skeletons';
import { ErrorState } from '../components/ui/ErrorState';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Image } from '../components/ui/Image';
import type { DownloadQuality } from '../types';

/**
 * Derive a clean anime title from episode's full title string.
 * Input example: "Watashi ga Koibito ... (Episode 01) Subtitle Indonesia"
 * Extracts the main title before the (Episode XX) part.
 */
function cleanEpisodeTitle(rawTitle: string): string {
  // Try to extract content before " (Episode ..."
  const match = rawTitle.match(/^(.+?)\s*\(.*[Ee]pisode.*\)/i);
  if (match?.[1]) return match[1].trim();
  // Fallback: strip everything after last " (" and "Subtitle Indonesia"
  return rawTitle
    .replace(/\s*\(Episode\s+\d+.*$/i, '')
    .replace(/\s*Subtitle Indonesia.*$/i, '')
    .trim() || rawTitle;
}

export default function WatchPage() {
  const { id, ep } = useParams<{ id: string; ep: string }>();
  const navigate = useNavigate();
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  const [autoNextEnabled, setAutoNextEnabled] = useState(true);
  const [showNextOverlay, setShowNextOverlay] = useState(false);
  const [countdown, setCountdown] = useState(8);
  const [nextEpisodeTarget, setNextEpisodeTarget] = useState<{ url: string; context: string }>();

  const { data: episodeData, isLoading: isEpLoading, error } = useEpisode(id, ep);
  const episodeSlug = episodeData?.slug;
  const { data: anime } = useAnimeDetail(id, episodeSlug, {
    enabled: Boolean(id && episodeSlug),
  });

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

  const playbackContext = `${ep ?? ''}:${activeServer ?? ''}`;

  useEffect(() => {
    if (!showNextOverlay || !nextEpisodeTarget || nextEpisodeTarget.context !== playbackContext) return;

    if (countdown <= 0) {
      navigate(nextEpisodeTarget.url);
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((current) => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown, navigate, nextEpisodeTarget, playbackContext, showNextOverlay]);

  // Save immediately from episode data, then enrich the same entry when detail arrives.
  useEffect(() => {
    if (!episodeData) return;

    const fallbackTitle = cleanEpisodeTitle(episodeData.title);
    const resolvedTitle = anime?.title || fallbackTitle;

    addHistory({
      animeId: id ?? episodeData.animeId,
      slug: episodeData.slug ?? anime?.slug ?? '',
      title: resolvedTitle,
      animeTitle: resolvedTitle,
      episode: episodeData.episode || ep || 1,
      cover: (anime?.cover as string | undefined) ?? '',
    });
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
  const displayTitle = anime?.title || cleanEpisodeTitle(episodeData.title);
  const genres = (anime?.genres ?? []) as Array<string | { name?: string }>;
  const backToDetailUrl = animeSlug ? `/anime/${id}/${animeSlug}` : `/anime/${id}`;

  const videoUrl = activeServer === 'kuramadrive' && defaultStreamUrl ? defaultStreamUrl : streamData?.videoUrl as string | undefined;
  const iframeUrl = streamData?.iframeUrl as string | undefined;
  const nextEpisodeUrl = nextEpNum ? `/anime/${id}/episode/${nextEpNum}` : undefined;
  const canAutoNext = isKuramaDrive && Boolean(nextEpisodeUrl);
  const isNextOverlayVisible = showNextOverlay && nextEpisodeTarget?.context === playbackContext;

  const cancelAutoNext = () => {
    setShowNextOverlay(false);
    setCountdown(8);
    setNextEpisodeTarget(undefined);
  };

  const handleVideoEnded = () => {
    if (!autoNextEnabled || !canAutoNext || !nextEpisodeUrl) return;
    setCountdown(8);
    setNextEpisodeTarget({ url: nextEpisodeUrl, context: playbackContext });
    setShowNextOverlay(true);
  };

  const continueToNextEpisode = () => {
    if (nextEpisodeTarget?.context === playbackContext) navigate(nextEpisodeTarget.url);
  };

  return (
    <div className="pb-16 relative">
      <div className="relative z-10 mx-auto flex max-w-[1920px] flex-col gap-6 px-4 py-6 md:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Anime', to: '/anime' },
            { label: displayTitle, to: backToDetailUrl },
            { label: `Episode ${episodeData.episode}` },
          ]}
          className="mb-2 backdrop-blur-sm bg-black/20 p-2 rounded-xl inline-flex self-start border border-white/5"
        />
        
        {/* Top Grid: Player (Left) + Server Selection (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Column: Player & Info */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <VideoPlayer
            key={`${activeServer}-${videoUrl ?? iframeUrl ?? 'none'}`}
            videoUrl={isKuramaDrive ? videoUrl : undefined}
            iframeUrl={!isKuramaDrive ? (iframeUrl ?? videoUrl) : undefined}
            title={`${displayTitle} · Episode ${ep}`}
            poster={anime?.cover as string | undefined}
            activeServerId={activeServer}
            isLoading={isStreamLoading}
            onEnded={handleVideoEnded}
            overlay={isNextOverlayVisible ? (
              <div className="flex h-full w-full items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-6">
                <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111620] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.55)] sm:p-6">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#00a3ff]/12 text-[#38bdf8]">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-white sm:text-xl">Episode selesai</h2>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        Melanjutkan ke Episode {nextEpNum} dalam <span className="font-bold text-white">{countdown} detik</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                    <div
                      className="h-full rounded-full bg-[#00a3ff] transition-[width] duration-1000 ease-linear"
                      style={{ width: `${Math.max(0, countdown / 8) * 100}%` }}
                    />
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={continueToNextEpisode}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#00a3ff] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0091e6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38bdf8]"
                    >
                      <SkipForward className="h-4 w-4" />
                      Lanjut sekarang
                    </button>
                    <button
                      type="button"
                      onClick={cancelAutoNext}
                      className="min-h-11 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              </div>
            ) : undefined}
          />

          {/* Episode Info & Navigation */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111620] p-4 sm:p-5 rounded-2xl border border-[#00a3ff]/10 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
            <div className="flex min-w-0 items-center gap-3">
              {anime?.cover ? (
                <Image
                  src={anime.cover}
                  alt=""
                  containerClassName="hidden h-16 w-12 shrink-0 rounded-lg ring-1 ring-white/10 sm:block"
                  className="h-full w-full object-cover"
                />
              ) : null}
              <div className="min-w-0">
                <Link to={backToDetailUrl} className="line-clamp-1 text-lg font-bold text-white transition-colors hover:text-[#00a3ff] sm:text-xl">
                  {displayTitle}
                </Link>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-[#00a3ff]/12 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#38bdf8]">
                    Episode {episodeData.episode}
                  </span>
                  {genres.slice(0, 3).map((genre, index) => {
                    const name = typeof genre === 'string' ? genre : genre.name;
                    return name ? (
                      <span key={`${name}-${index}`} className="text-[11px] font-medium text-slate-500">
                        {name.replace(/,$/, '')}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <NavBtn to={prevEpNum ? `/anime/${id}/episode/${prevEpNum}` : undefined} label="Episode Sebelumnya" icon={<ChevronLeft className="w-5 h-5" />} text="Prev" />
              <label
                className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 transition-colors sm:px-4 ${
                  canAutoNext
                    ? 'cursor-pointer border-white/10 bg-[#0b0e14] text-slate-200 hover:border-white/20'
                    : 'cursor-not-allowed border-white/5 bg-[#0b0e14]/50 text-slate-600'
                }`}
                title={canAutoNext ? 'Lanjut otomatis setelah video selesai' : 'Hanya tersedia di server Kuranime dan jika ada episode berikutnya'}
              >
                <SkipForward className="h-4 w-4 shrink-0" />
                <span className="hidden text-xs font-bold uppercase tracking-wider sm:block">Auto Next</span>
                <input
                  type="checkbox"
                  checked={autoNextEnabled}
                  disabled={!canAutoNext}
                  onChange={(event) => setAutoNextEnabled(event.target.checked)}
                  className="peer sr-only"
                />
                <span className="relative h-5 w-9 shrink-0 rounded-full bg-slate-700 transition-colors peer-checked:bg-[#00a3ff] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#38bdf8] peer-disabled:opacity-40 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4" aria-hidden="true" />
              </label>
              <NavBtn to={nextEpisodeUrl} label="Episode Selanjutnya" icon={<ChevronRight className="w-5 h-5" />} text="Next" reverse />
            </div>
          </div>
        </div>

        {/* Right Column: Server Selector + Episode List */}
        <aside className="flex flex-col gap-6 lg:col-span-1 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-white/5 bg-[#111620] p-5 shadow-lg">
            <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
              <Radio className="h-4 w-4 text-[#00a3ff]" />
              <h3 className="text-sm font-semibold tracking-wide text-slate-200">Server Streaming</h3>
            </div>
            {servers.length > 0 || defaultStreamUrl ? (
              <div className="custom-scrollbar grid max-h-100 grid-cols-2 gap-2.5 overflow-y-auto pr-2 sm:grid-cols-3 lg:grid-cols-2">
                {defaultStreamUrl && !servers.some(s => s.id === 'kuramadrive') && (
                  <ServerBtn
                    isActive={activeServer === 'kuramadrive'}
                    onClick={() => setSelectedServer('kuramadrive')}
                    label="Kuranime (Default)"
                  />
                )}
                {servers.map((server) => {
                  const serverId = server.id ?? '';
                  const rawLabel = server.label ?? server.name ?? serverId;
                  const serverLabel = rawLabel.replace(/^Kuramadrive\s*s1.*$/i, 'Kuranime');
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
              <div className="rounded-xl border border-white/5 bg-black/20 py-8 text-center text-sm text-slate-500">
                Tidak ada server alternatif.
              </div>
            )}
          </div>

          {sortedEpisodes.length > 0 && (
            <div className="rounded-2xl border border-white/5 bg-[#111620] p-5 shadow-lg">
              <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
                <List className="h-4 w-4 text-[#00a3ff]" />
                <h3 className="text-sm font-semibold tracking-wide text-slate-200">Semua Episode</h3>
                <span className="ml-auto rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium text-slate-500">
                  {sortedEpisodes.length} Ep
                </span>
              </div>

              <div className="custom-scrollbar grid max-h-[280px] grid-cols-4 gap-2 overflow-y-auto pr-2 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-5">
                {sortedEpisodes.map((episodeItem) => {
                  const isCurrent = String(episodeItem.episode) === String(ep);
                  return (
                    <Link
                      key={episodeItem.episode}
                      to={`/anime/${id}/episode/${episodeItem.episode}`}
                      aria-current={isCurrent ? 'page' : undefined}
                      className={`flex min-h-10 items-center justify-center rounded-xl border px-1 py-2 transition-all ${
                        isCurrent
                          ? 'pointer-events-none border-[#00a3ff]/50 bg-[#00a3ff]/15 text-[#00a3ff] shadow-[0_0_12px_rgba(0,163,255,0.1)]'
                          : 'border-white/[0.04] bg-[#0b0e14]/80 text-slate-400 hover:border-white/10 hover:bg-[#1a1f2e] hover:text-slate-200'
                      }`}
                    >
                      <span className="text-sm font-bold">{episodeItem.episode}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
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
                <div key={i} className="bg-[#0b0e14]/80 backdrop-blur-sm border border-white/[0.04] rounded-xl p-3.5 hover:border-white/10 transition-colors">
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

      </div>
    </div>
    </div>
  );
}

function ServerBtn({ isActive, onClick, label }: { isActive: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`group relative flex items-center overflow-hidden rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition-all ${
        isActive
          ? 'border-[#00a3ff]/40 bg-linear-to-r from-[#00a3ff]/15 to-transparent text-[#00a3ff] shadow-[0_0_16px_rgba(0,163,255,0.15)]'
          : 'border-white/5 bg-[#0b0e14]/80 text-slate-400 backdrop-blur-sm hover:border-white/10 hover:bg-[#1a1f2e] hover:text-slate-200'
      }`}
    >
      {isActive && (
        <span className="absolute bottom-0 left-0 top-0 w-1 bg-[#00a3ff] shadow-[0_0_8px_rgba(0,163,255,0.8)]" />
      )}
      <span className={`min-w-0 truncate ${isActive ? 'pl-1.5' : ''}`}>{label}</span>
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
