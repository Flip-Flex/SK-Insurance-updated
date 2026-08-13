import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/contexts/AuthContext';
import { Loader } from '../ui/Loader';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, isManager } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-navy-950">
        <Loader />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isManager) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
