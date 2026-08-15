import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center gap-6">
      <div className="text-8xl font-black text-[#0b0e14] border-4 border-[#00a3ff]/20 w-32 h-32 rounded-3xl flex items-center justify-center text-slate-700 select-none">
        404
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Halaman Tidak Ditemukan</h1>
        <p className="text-slate-500">Halaman yang kamu cari tidak ada atau telah dihapus.</p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-2 bg-[#00a3ff] hover:bg-[#00a3ff]/90 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm"
        >
          <Home className="w-4 h-4" />
          Ke Beranda
        </Link>
        <Link
          to="/anime"
          className="flex items-center gap-2 bg-[#121620] border border-white/10 text-slate-300 hover:text-white px-5 py-2.5 rounded-xl font-semibold transition-colors text-sm"
        >
          <Search className="w-4 h-4" />
          Cari Anime
        </Link>
      </div>
    </div>
  );
}
