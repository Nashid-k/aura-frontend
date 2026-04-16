import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../providers/AuthContext';

export function ProtectedRoute({ children }) {
  const { ready, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return children;
}
