import axios from 'axios';

// Base URL for the Spring Boot Backend API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to automatically add the JWT token to headers if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 token expiry (Issue #7)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Don't redirect if we're already on a login/register page
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/register' || currentPath === '/admin/login';

      if (!isAuthPage) {
        // Clear auth data
        authService.clearAuth();

        // Dispatch custom event so App.js can update isLoggedIn state
        window.dispatchEvent(new CustomEvent('auth:logout'));

        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth utility functions
export const authService = {
  // Save token and role
  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  // Clear auth data
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Get current user data
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  // Check if authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  // Check if user is admin
  isAdmin: () => {
    const user = authService.getUser();
    return user?.role === 'ROLE_ADMIN';
  }
};

export const getImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return `http://localhost:8080${url}`;
};

export default api;
