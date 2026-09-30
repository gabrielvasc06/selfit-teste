import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user?.senha_provisoria) {
    return <Navigate to="/login" replace state={{ from: location, forcePasswordChange: true }} />;
  }

  return children;
}

export default ProtectedRoute;
