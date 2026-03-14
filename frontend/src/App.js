import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import DiscoveryHub from "./Pages/DiscoveryHub";
import ReportItem from "./Pages/ReportItem";
import Foundpage from "./Pages/Foundpage";
import ItemDetail from "./Pages/ItemDetail";
import MyReports from "./Pages/Myreport";
import ProfilePage from "./Pages/Profilepage";
import "./styles.css";

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default to false for testing login
  const location = useLocation();

  const authPaths = ["/", "/Login", "/register", "/about", "/howitworks"];
  const isAuthPage = authPaths.includes(location.pathname);

  return (
    <div className={isAuthPage ? "app-container auth-bg" : "app-container"}>
      {/* Header is now globally available and reactive to isLoggedIn */}

      
      <Routes>
        <Route path="/" element={isLoggedIn ? <DiscoveryHub /> : <HomePage />} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />} />
        <Route path="/register" element={<RegisterPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/discovery" element={<DiscoveryHub />} />
        <Route path="/about" element={<div><h2>About Us</h2><p>This is the about page.</p></div>} />
        <Route path="/howitworks" element={<div><h2>How It Works</h2><p>This is the how it works page.</p></div>} />
        <Route path="/report" element={<ReportItem isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/found" element={<Foundpage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/item/:id" element={<ItemDetail isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/myreports" element={<MyReports isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/profile" element={<ProfilePage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>

    </div>
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