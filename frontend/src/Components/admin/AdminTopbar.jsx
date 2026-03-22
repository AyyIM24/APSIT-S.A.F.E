import React, { useContext } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';

/**
 * AdminTopbar — PRD §11.1
 * White header bar with page title and admin avatar.
 */
const AdminTopbar = ({ pageTitle }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div className="admin-topbar">
      <h1 className="admin-topbar-title">{pageTitle || 'Dashboard'}</h1>
      <div className="admin-topbar-right">
        <button onClick={toggleTheme} className="theme-toggle-btn" style={{ color: '#120058', borderColor: 'rgba(18,0,88,0.2)' }} aria-label="Toggle Theme">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <span className="admin-topbar-name">Admin</span>
        <div className="admin-topbar-avatar">A</div>
      </div>
    </div>
  );
};

export default AdminTopbar;
