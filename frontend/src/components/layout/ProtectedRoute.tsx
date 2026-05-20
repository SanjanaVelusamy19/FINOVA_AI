import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PageLoader } from '../ui/PageLoader';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <PageLoader label="Loading secure workspace..." />;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
