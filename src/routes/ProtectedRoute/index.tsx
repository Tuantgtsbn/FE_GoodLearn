import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type IRootState } from '@redux/store';
import { ERole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ERole[];
  requireAuth?: boolean;
  guestOnly?: boolean;
}

function ProtectedRoute({
  children,
  allowedRoles = [],
  requireAuth = true,
  guestOnly = false,
}: ProtectedRouteProps) {
  const { user, accessToken, isAuthenticated } = useSelector(
    (state: IRootState) => state.auth
  );
  const userRole = user?.role;
  if (requireAuth && !accessToken) {
    return <Navigate to="/auth/login" replace />;
  }

  if (guestOnly && isAuthenticated && user && userRole) {
    switch (userRole) {
      case ERole.USER:
        return <Navigate to="/" replace />;
      case ERole.ADMIN:
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    switch (userRole) {
      case ERole.USER:
        return <Navigate to="/" replace />;
      case ERole.ADMIN:
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/auth/login" replace />;
    }
  }

  return <>{children}</>;
}

export default ProtectedRoute;
