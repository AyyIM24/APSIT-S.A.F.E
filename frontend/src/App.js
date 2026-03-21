import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import './styles.css';
import './animations.css';

// Shared Components
import ThreeBackground from './Components/ThreeBackground';
import PageTransitionWrapper from './Components/PageTransitionWrapper';
import Header from './Components/Header';
import Footer from './Components/Footer';

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

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHomePage = location.pathname === '/';

  const handleLogin = async (credentials) => {
    console.log("Login attempt with:", credentials);
    setIsLoggedIn(true);
  };

  return (
    <>
      <ThreeBackground />

      <div className="app-container">
        {!isAdminRoute && !isHomePage && (
          <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        )}

        <PageTransitionWrapper>
          <Routes>
            {/* Student Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage onLogin={handleLogin} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
            <Route path="/register" element={<RegisterPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/discovery" element={<DiscoveryHub isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/item/:id" element={<ItemDetail isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/myreports" element={<MyReports isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/profile" element={<ProfilePage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/report" element={<ReportItem isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/found" element={<Foundpage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/lost" element={<AdminLostItems />} />
            <Route path="/admin/found" element={<AdminFoundItems />} />
            <Route path="/admin/claims" element={<AdminClaimRequests />} />
            <Route path="/admin/admins" element={<AdminAdmins />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/item/:id/qr" element={<AdminQRView />} />
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