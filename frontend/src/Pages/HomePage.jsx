import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from '../contexts/ThemeContext';
import logo from '../Logo.png';

function HomePage() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="home-dark">
      <div className="home-content">
        {/* Header Banner */}
        <div className="home-header-banner anim-fadeScale">
          <img src={logo} alt="APSIT Logo" />
          <h1 style={{ flex: 1, textAlign: 'center' }}>APSIT S.A.F.E</h1>
          <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle Theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Welcome Info Section */}
        <div className="home-info-section anim-fadeScale" style={{ animationDelay: '0.2s' }}>
          <h2>Lost something on campus? Found something?</h2>
          <p>We've got you covered.</p>
          <p style={{ fontSize: '0.95rem', marginTop: '8px', opacity: 0.7 }}>
            Student Asset & Found-item Exchange — your campus lost-and-found made simple.
          </p>
        </div>

        {/* Portal Cards */}
        <div className="home-portals">
          <div className="home-portal-card anim-slideInLeft">
            <div className="portal-icon">🛡️</div>
            <h2>Admin Portal</h2>
            <p>Manage reports, verify claims, and oversee campus items.</p>
            <div className="portal-btns">
              <Link to="/admin/login">
                <button className="portal-btn">Admin Login →</button>
              </Link>
            </div>
          </div>

          <div className="home-portal-card anim-slideInRight">
            <div className="portal-icon">🎓</div>
            <h2>Student Portal</h2>
            <p>Report lost items, browse found items, and claim what's yours.</p>
            <div className="portal-btns">
              <Link to="/login">
                <button className="portal-btn">Login →</button>
              </Link>
              <Link to="/register">
                <button className="portal-btn portal-btn-outline">Register</button>
              </Link>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

export default HomePage;
