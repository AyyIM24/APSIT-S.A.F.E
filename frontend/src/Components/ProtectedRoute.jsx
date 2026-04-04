import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/api';

/**
 * ProtectedRoute — wraps student routes that require authentication.
 * Redirects to /login if the user is not logged in.
 */
export const ProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

/**
 * AdminRoute — wraps admin routes that require admin authentication.
 * Redirects to /admin/login if the user is not an admin.
 */
export const AdminRoute = ({ children }) => {
  if (!authService.isAuthenticated() || !authService.isAdmin()) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
