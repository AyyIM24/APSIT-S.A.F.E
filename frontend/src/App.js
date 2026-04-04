import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import './styles.css';
import './animations.css';

// Shared Components
import ThreeBackground from './Components/ThreeBackground';
import CustomCursor from './Components/CustomCursor';
import PageTransitionWrapper from './Components/PageTransitionWrapper';
import Header from './Components/Header';
import Footer from './Components/Footer';
import { ProtectedRoute, AdminRoute } from './Components/ProtectedRoute';

// Student Pages
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import RegisterPage from './Pages/RegisterPage';
import DiscoveryHub from './Pages/DiscoveryHub';
import ItemDetail from './Pages/ItemDetail';
import MyReports from './Pages/Myreport';
import ProfilePage from './Pages/Profilepage';
import ReportItem from './Pages/ReportItem';
import Foundpage from './Pages/Foundpage';
import NotFoundPage from './Pages/NotFoundPage';

// Admin Pages
import AdminLoginPage from './Pages/admin/AdminLoginPage';
import AdminDashboard from './Pages/admin/AdminDashboard';
import AdminLostItems from './Pages/admin/AdminLostItems';
import AdminFoundItems from './Pages/admin/AdminFoundItems';
import AdminClaimRequests from './Pages/admin/AdminClaimRequests';
import AdminUsers from './Pages/admin/AdminUsers';
import AdminReports from './Pages/admin/AdminReports';
import AdminCategories from './Pages/admin/AdminCategories';
import AdminAdmins from './Pages/admin/AdminAdmins';
import AdminQRView from './Pages/admin/AdminQRView';

import { authService } from './services/api';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHomePage = location.pathname === '/';

  // Listen for auth:logout events dispatched by the 401 interceptor
  useEffect(() => {
    const handleLogout = () => {
      setIsLoggedIn(false);
    };
    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  const handleLogin = async (credentials) => {
    setIsLoggedIn(true);
  };

  return (
    <>
      <CustomCursor />
      <ThreeBackground />

      <div className="app-container">
        {!isAdminRoute && !isHomePage && (
          <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        )}

        <PageTransitionWrapper>
          <Routes>
            {/* Public Student Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
            <Route path="/register" element={<RegisterPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/discovery" element={<DiscoveryHub isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/item/:id" element={<ItemDetail isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />

            {/* Protected Student Routes */}
            <Route path="/myreports" element={<ProtectedRoute><MyReports isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><ReportItem isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /></ProtectedRoute>} />
            <Route path="/found" element={<ProtectedRoute><Foundpage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} /></ProtectedRoute>} />

            {/* Admin Login (public) */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/lost" element={<AdminRoute><AdminLostItems /></AdminRoute>} />
            <Route path="/admin/found" element={<AdminRoute><AdminFoundItems /></AdminRoute>} />
            <Route path="/admin/claims" element={<AdminRoute><AdminClaimRequests /></AdminRoute>} />
            <Route path="/admin/admins" element={<AdminRoute><AdminAdmins /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
            <Route path="/admin/item/:id/qr" element={<AdminRoute><AdminQRView /></AdminRoute>} />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </PageTransitionWrapper>

        {!isAdminRoute && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;