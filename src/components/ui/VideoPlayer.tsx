import { useEffect, useState } from 'react';
import { Loader2, Server } from 'lucide-react';
import { KuramaDrivePlyr } from './KuramaDrivePlyr';

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
  const isKuramaDrive = activeServerId === 'kuramadrive';

  useEffect(() => {
    if (!iframeUrl) return;
    const preload = document.createElement('link');
    preload.rel = 'preconnect';
    preload.href = new URL(iframeUrl).origin;
    document.head.appendChild(preload);
    return () => preload.remove();
  }, [iframeUrl]);

  const hasSource = Boolean(videoUrl || iframeUrl);

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
          {isKuramaDrive ? 'Plyr · HLS' : 'Embed'}
        </span>
      </div>

      <div className="relative aspect-video w-full bg-black">
        {isLoading ? (
          <PlayerLoading label="Menyiapkan streaming..." />
        ) : !hasSource ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#090b10] px-4 text-center">
            <Server className="h-11 w-11 text-slate-700" />
            <p className="text-sm font-medium text-slate-400">Video belum tersedia di server ini.</p>
            <p className="text-xs text-slate-600">Silakan pilih server lain di bawah player.</p>
          </div>
        ) : isKuramaDrive && videoUrl ? (
          <KuramaDrivePlyr videoUrl={videoUrl} poster={poster} title={title} onEnded={onEnded} />
        ) : videoUrl ? (
          <video
            src={videoUrl}
            poster={poster}
            controls
            autoPlay
            playsInline
            onEnded={onEnded}
            className="h-full w-full object-contain"
          />
        ) : iframeUrl ? (
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
          {isKuramaDrive ? 'Akselerasi HLS aktif melalui hls.js' : 'Kontrol video mengikuti provider aktif'}
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
