import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './app/routes/ProtectedRoute';
import { useAuth } from './app/providers/AuthContext';
import { HabitDetailPage } from './pages/HabitDetailPage';
import { AuthPage } from './pages/AuthPage';
import { AppShell } from './shared/ui/AppShell';
import { DashboardProvider } from './app/providers/DashboardContext';
import { ProgressPage } from './pages/ProgressPage';
import { RemindersPage } from './pages/RemindersPage';
import { TodayPage } from './pages/TodayPage';
import { VaultPage } from './pages/VaultPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { IdentityPage } from './pages/IdentityPage';
import { JournalPage } from './pages/JournalPage';
import { LandingPage } from './pages/LandingPage';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/today" replace /> : <LandingPage />} />
      <Route path="/auth" element={isAuthenticated ? <Navigate to="/today" replace /> : <AuthPage />} />
      
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardProvider>
              <AppShell />
            </DashboardProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/today" replace />} />
        <Route path="today" element={<TodayPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="identity" element={<IdentityPage />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="reminders" element={<RemindersPage />} />
        <Route path="vault" element={<VaultPage />} />
        <Route path="achievements" element={<AchievementsPage />} />
      </Route>

      <Route
        path="/today"
        element={<Navigate to="/app/today" replace />}
      />

      <Route
        path="/habits/:id"
        element={
          <ProtectedRoute>
            <HabitDetailPage />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
