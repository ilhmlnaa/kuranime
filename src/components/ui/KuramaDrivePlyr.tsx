// src/components/ui/KuramaDrivePlyr.tsx
// Player berbasis Plyr + HLS.js khusus untuk server kuramadrive (stream .mp4 / HLS)
// Library dimuat via CDN secara dinamis (tidak perlu npm install)

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface KuramaDrivePlyrProps {
  videoUrl: string;
  title?: string;
  poster?: string;
  onEnded?: () => void;
}

const PLYR_VERSION = '3.7.8';
const HLS_VERSION = '1.5.13';

const CDN_PLYR_CSS = `https://cdnjs.cloudflare.com/ajax/libs/plyr/${PLYR_VERSION}/plyr.css`;
const CDN_PLYR_JS = `https://cdnjs.cloudflare.com/ajax/libs/plyr/${PLYR_VERSION}/plyr.min.js`;
const CDN_HLS_JS = `https://cdnjs.cloudflare.com/ajax/libs/hls.js/${HLS_VERSION}/hls.min.js`;

function injectLink(href: string, id: string) {
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

function injectScript(src: string, id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) { resolve(); return; }
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Plyr: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Hls: any;
  }
}

export function KuramaDrivePlyr({ videoUrl, title, poster, onEnded }: KuramaDrivePlyrProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<unknown>(null);
  const [libsReady, setLibsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Load CSS + JS dari CDN satu kali
  useEffect(() => {
    let cancelled = false;
    injectLink(CDN_PLYR_CSS, 'plyr-css');

    Promise.all([
      injectScript(CDN_HLS_JS, 'hls-js'),
      injectScript(CDN_PLYR_JS, 'plyr-js'),
    ])
      .then(() => { if (!cancelled) setLibsReady(true); })
      .catch((err: Error) => {
        if (!cancelled) { setHasError(true); setErrorMsg(err.message); }
      });

    return () => { cancelled = true; };
  }, []);

  // Inisialisasi Plyr + HLS setelah libs siap dan videoRef tersedia
  useEffect(() => {
    if (!libsReady || !videoRef.current) return;
    const video = videoRef.current;

    // Bersihkan instance sebelumnya
    if (playerRef.current) {
      try { (playerRef.current as { destroy: () => void }).destroy(); } catch { /* ignore */ }
      playerRef.current = null;
    }

    const PlyrClass = typeof window.Plyr === 'function' ? window.Plyr : window.Plyr?.default;
    if (!PlyrClass) {
      Promise.resolve().then(() => {
        setHasError(true);
        setErrorMsg('Plyr gagal dimuat');
      });
      return;
    }

    const isHls = videoUrl.includes('.m3u8') || videoUrl.includes('kuramadrive') || videoUrl.includes('asuna.my.id');

    if (isHls && window.Hls?.isSupported()) {
      const hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: false,
        startLevel: -1,
      });
      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(window.Hls.Events.ERROR, (_: unknown, data: { fatal: boolean }) => {
        if (data.fatal) { setHasError(true); setErrorMsg('HLS stream gagal dimuat.'); }
      });

      const plyr = new PlyrClass(video, {
        controls: [
          'play-large', 'play', 'progress', 'current-time', 'duration',
          'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen',
        ],
        settings: ['speed', 'quality'],
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 2] },
        tooltips: { controls: true, seek: true },
        keyboard: { focused: true, global: false },
        i18n: {
          play: 'Putar',
          pause: 'Jeda',
          mute: 'Bisukan',
          unmute: 'Nyalakan suara',
          settings: 'Pengaturan',
          fullscreen: 'Layar penuh',
          exitFullscreen: 'Keluar layar penuh',
          speed: 'Kecepatan',
          normal: 'Normal',
        },
      });

      if (onEnded) plyr.on('ended', onEnded);
      plyr.on('error', () => { setHasError(true); setErrorMsg('Gagal memutar video.'); });

      playerRef.current = { destroy: () => { plyr.destroy(); hls.destroy(); } };
    } else {
      // Native fallback (misal browser safari yg support HLS native)
      video.src = videoUrl;
      const plyr = new PlyrClass(video, {
        controls: [
          'play-large', 'play', 'progress', 'current-time', 'duration',
          'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen',
        ],
      });
      if (onEnded) plyr.on('ended', onEnded);
      playerRef.current = { destroy: () => { plyr.destroy(); } };
    }

    return () => {
      if (playerRef.current) {
        try { (playerRef.current as { destroy: () => void }).destroy(); } catch { /* ignore */ }
        playerRef.current = null;
      }
    };
  }, [libsReady, videoUrl, onEnded]);

  if (hasError) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0b0e14]/95">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-sm font-semibold text-slate-200">Gagal memuat video</p>
        <p className="text-xs text-slate-500 max-w-xs text-center">{errorMsg || 'Coba ganti server streaming.'}</p>
        <button
          type="button"
          onClick={() => { setHasError(false); setErrorMsg(''); }}
          className="mt-2 flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-xs font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Coba Lagi
        </button>
      </div>
    );
  }

  if (!libsReady) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0b0e14]">
        <div className="w-10 h-10 border-4 border-[#00a3ff]/20 border-t-[#00a3ff] rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Memuat Plyr Player...</p>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      poster={poster}
      playsInline
      title={title}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
