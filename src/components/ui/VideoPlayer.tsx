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
      {/* Minimal Modern Browser-like Top Bar */}
      <div className="relative flex min-h-10 items-center justify-between border-b border-white/[0.05] bg-gradient-to-r from-[#0d1117] via-[#111620] to-[#0d1117] px-4">
        <div className="flex items-center gap-1.5 flex-shrink-0" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-[#00a3ff]/80 shadow-[0_0_6px_rgba(0,163,255,0.5)]" />
          <span className="h-2 w-2 rounded-full bg-[#00a3ff]/40" />
          <span className="h-2 w-2 rounded-full bg-[#00a3ff]/20" />
        </div>
        
        <p className="absolute left-1/2 -translate-x-1/2 max-w-[55%] truncate text-[11px] font-medium text-slate-400 tracking-wide">
          {title ?? 'Kuranime Player'}
        </p>
        
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00a3ff] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#00a3ff]" />
          </span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">
            {isKuramaDrive ? (proxiedSource?.type === 'hls' ? 'HLS' : 'MP4') : 'Embed'}
          </span>
        </div>
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

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.05] bg-[#0d1117] px-4 py-2">
        <p className="text-[10px] font-medium text-slate-600 tracking-wide">
          {isKuramaDrive
            ? proxiedSource?.type === 'hls'
              ? 'Secure HLS stream via ZenProxy'
              : 'Secure video stream via ZenProxy'
            : 'External provider embed'}
        </p>
        <p className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-[#00a3ff]/70">Kuranime</p>
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
