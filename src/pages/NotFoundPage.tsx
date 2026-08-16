import { Link } from 'react-router-dom';
import { Home, Search, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] px-4 text-center relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#00a3ff]/20 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        <div className="relative group">
          <div className="absolute inset-0 bg-[#00a3ff]/20 blur-2xl rounded-full scale-75 group-hover:scale-110 transition-transform duration-700" />
          <div className="relative flex items-center justify-center w-40 h-40 rounded-[2.5rem] bg-linear-to-b from-[#111827] to-[#0a0f16] border border-white/10 shadow-[0_0_40px_rgba(0,163,255,0.15)] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,163,255,0.1)_0%,transparent_70%)]" />
            <h1 className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-b from-white via-white/80 to-white/20 tracking-tighter drop-shadow-sm">
              404
            </h1>
          </div>
        </div>

        <div className="space-y-3 max-w-sm">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <AlertCircle className="w-6 h-6 text-[#00a3ff]" />
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Sistem kami tidak dapat menemukan rute yang Anda minta. Anime ini mungkin telah dihapus, dipindahkan, atau link yang Anda ikuti sudah usang.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <Link
            to="/"
            className="flex items-center gap-2 bg-[#00a3ff] hover:bg-[#00a3ff]/90 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm shadow-[0_4px_16px_rgba(0,163,255,0.3)] hover:shadow-[0_4px_24px_rgba(0,163,255,0.4)] active:scale-95"
          >
            <Home className="w-4 h-4" />
            Ke Beranda
          </Link>
          <Link
            to="/anime"
            className="flex items-center gap-2 bg-[#121620] border border-white/10 text-slate-300 hover:bg-[#1a1f2e] hover:text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm hover:border-white/20 active:scale-95"
          >
            <Search className="w-4 h-4" />
            Cari Anime
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
