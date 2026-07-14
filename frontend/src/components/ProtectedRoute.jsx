import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user doesn't have required role, maybe redirect them to their respective dashboard
    if (user.role === 'Admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/shopper" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
