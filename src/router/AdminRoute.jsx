import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const ALLOWED_ROLES = ['SUPERVISOR', 'ADMIN'];

export default function AdminRoute() {
  const { user } = useAuth();

  if (!user || !ALLOWED_ROLES.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
