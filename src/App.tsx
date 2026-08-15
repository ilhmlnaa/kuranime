import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import HomePage from './pages/HomePage';
import AnimeListPage from './pages/AnimeListPage';
import AnimeDetailPage from './pages/AnimeDetailPage';
import WatchPage from './pages/WatchPage';
import WatchlistPage from './pages/WatchlistPage';
import HistoryPage from './pages/HistoryPage';
import SchedulePage from './pages/SchedulePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/anime" element={<AnimeListPage />} />
        <Route path="/anime/:id" element={<AnimeDetailPage />} />
        <Route path="/anime/:id/:slug" element={<AnimeDetailPage />} />
        <Route path="/anime/:id/episode/:ep" element={<WatchPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  );
}

export default App;
