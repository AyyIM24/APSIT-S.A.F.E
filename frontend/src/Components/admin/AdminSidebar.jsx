import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

/**
 * AdminSidebar — matches hand-drawn prototype exactly:
 * APSIT S.A.F.E branding, then:
 * Dashboard, Lost Items, Found Items, Admins, Categories, Claim Request, Users, Reports, Logout
 */
const navItems = [
  { path: '/admin',            icon: '🏠', label: 'Dashboard' },
  { path: '/admin/lost',       icon: '📦', label: 'Lost Items' },
  { path: '/admin/found',      icon: '🔍', label: 'Found Items' },
  { path: '/admin/admins',     icon: '👑', label: 'Admins' },
  { path: '/admin/categories', icon: '🏷️', label: 'Categories' },
  { path: '/admin/claims',     icon: '📋', label: 'Claim Requests' },
  { path: '/admin/handed-over', icon: '✅', label: 'Handed Over Items' },
  { path: '/admin/users',      icon: '👥', label: 'Users' },
  { path: '/admin/reports',    icon: '📊', label: 'Reports' },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="admin-sidebar-new">
      <div className="admin-sidebar-brand">
        <span style={{ fontSize: '1.5rem', marginRight: '8px' }}>🛡️</span>
        APSIT S.A.F.E
      </div>
      <ul className="admin-sidebar-nav">
        {navItems.map((item, idx) => (
          <li key={item.path} className="anim-sidebarLinkStagger" style={{ animationDelay: `${idx * 0.06}s` }}>
            <Link
              to={item.path}
              className={`admin-nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
        <li className="anim-sidebarLinkStagger" style={{ animationDelay: `${navItems.length * 0.06}s`, marginTop: 'auto' }}>
          <button className="admin-nav-link logout-link" onClick={() => navigate('/')}>
            <span className="admin-nav-icon">🚪</span>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default AdminSidebar;
