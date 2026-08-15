import { useEffect, useState } from 'react';
import { Loader2, Server } from 'lucide-react';
import { KuramaDrivePlyr } from './KuramaDrivePlyr';
import { getProxiedVideoSource } from '../../utils/proxy';

export interface VideoPlayerProps {
  videoUrl?: string;
  iframeUrl?: string;
  title?: string;
  poster?: string;
  activeServerId?: string;
  isLoading?: boolean;
  onEnded?: () => void;
  className?: string;
}

export function VideoPlayer({
  videoUrl,
  iframeUrl,
  title,
  poster,
  activeServerId,
  isLoading = false,
  onEnded,
  className = '',
}: VideoPlayerProps) {
  const [loadedIframeUrl, setLoadedIframeUrl] = useState<string>();
  const iframeLoaded = Boolean(iframeUrl && loadedIframeUrl === iframeUrl);
  const isKuramaDrive = activeServerId === 'kuramadrive' || activeServerId === 'kdrive';

  // Proxy the direct video URL via ZenProxy (/video or /hls depending on format)
  const proxiedSource = getProxiedVideoSource(videoUrl);

  useEffect(() => {
    if (!iframeUrl) return;
    try {
      const preload = document.createElement('link');
      preload.rel = 'preconnect';
      preload.href = new URL(iframeUrl).origin;
      document.head.appendChild(preload);
      return () => preload.remove();
    } catch {
      /* ignore invalid iframe URLs */
    }
  }, [iframeUrl]);

  const hasSource = Boolean(proxiedSource || iframeUrl);

  return (
    <section
      className={`relative overflow-hidden rounded-2xl bg-[#090b10] shadow-[0_28px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/10 ${className}`}
      aria-label={title ? `Pemutar video: ${title}` : 'Pemutar video'}
    >
      <div className="flex min-h-11 items-center justify-between border-b border-white/[0.07] bg-[#111620] px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="h-2 w-2 shrink-0 rounded-full bg-[#00a3ff] shadow-[0_0_12px_rgba(0,163,255,0.7)]" />
          <p className="truncate text-xs font-medium text-slate-300">{title ?? 'Kuranime Player'}</p>
        </div>
        <span className="ml-3 shrink-0 rounded-full bg-white/[0.05] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          {isKuramaDrive ? (proxiedSource?.type === 'hls' ? 'Plyr · HLS' : 'Plyr · MP4') : 'Embed'}
        </span>
      </div>

      <div className="relative w-full bg-black aspect-video overflow-hidden">
        {isLoading ? (
          <PlayerLoading label="Menyiapkan streaming..." />
        ) : !hasSource ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#090b10] px-4 text-center">
            <Server className="h-11 w-11 text-slate-700" />
            <p className="text-sm font-medium text-slate-400">Video belum tersedia di server ini.</p>
            <p className="text-xs text-slate-600">Silakan pilih server lain di bawah player.</p>
          </div>
        ) : isKuramaDrive && proxiedSource ? (
          /* KuramaDrive Stream via ZenProxy + Plyr */
          <div className="absolute inset-0 h-full w-full [&_.plyr]:h-full [&_.plyr]:w-full [&_.plyr__video-wrapper]:h-full [&_.plyr__video-wrapper]:w-full [&_video]:h-full [&_video]:w-full [&_video]:object-contain">
            <KuramaDrivePlyr
              videoUrl={proxiedSource.url}
              streamType={proxiedSource.type}
              poster={poster}
              title={title}
              onEnded={onEnded}
            />
          </div>
        ) : proxiedSource ? (
          /* Other direct MP4 video sources */
          <video
            src={proxiedSource.url}
            poster={poster}
            controls
            autoPlay
            playsInline
            onEnded={onEnded}
            className="h-full w-full object-contain"
          />
        ) : iframeUrl ? (
          /* Embed iframe servers (Doodstream, Mega, Filemoon, dll.) */
          <>
            {!iframeLoaded ? <PlayerLoading label="Memuat embed server..." /> : null}
            <iframe
              src={iframeUrl}
              title={title ?? 'Anime stream'}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="no-referrer"
              allowFullScreen
              onLoad={() => setLoadedIframeUrl(iframeUrl)}
            />
          </>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] bg-[#111620] px-4 py-2.5">
        <p className="text-[11px] text-slate-500">
          {isKuramaDrive
            ? proxiedSource?.type === 'hls'
              ? 'Akselerasi HLS via ZenProxy & hls.js'
              : 'Streaming video via ZenProxy & Plyr'
            : 'Kontrol video mengikuti provider aktif'}
        </p>
        <p className="shrink-0 text-[11px] font-medium text-[#00a3ff]">Kuranime</p>
      </div>
    </section>
  );
}

function PlayerLoading({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#090b10]">
      <Loader2 className="h-9 w-9 animate-spin text-[#00a3ff]" />
      <p className="text-xs font-medium text-slate-500">{label}</p>
    </div>
  );
}
