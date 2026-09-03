import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const StudentRoute = () => {
  const { isAuthenticated, isStudent, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
          <p className="text-sm font-medium text-slate-600">Loading Student Portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAdmin) {
    // If admin is logged in, redirect them to their management dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (!isStudent) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default StudentRoute;
