import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import MatchPage from './pages/MatchPage';
import ArenaPage from './pages/ArenaPage';
import ResultsPage from './pages/ResultsPage';
import LeaderboardPage from './pages/LeaderboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/matches" element={<MatchPage />} />
          <Route path="/matches/:matchId" element={<ArenaPage />} />
          <Route path="/arena/:matchId" element={<ArenaPage />} />
          <Route path="/results/:matchId" element={<ResultsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
