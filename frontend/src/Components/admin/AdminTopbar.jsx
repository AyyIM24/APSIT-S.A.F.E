import React from 'react';

/**
 * AdminTopbar — PRD §11.1
 * White header bar with page title and admin avatar.
 */
const AdminTopbar = ({ pageTitle }) => (
  <div className="admin-topbar">
    <h1 className="admin-topbar-title">{pageTitle || 'Dashboard'}</h1>
    <div className="admin-topbar-right">
      <span className="admin-topbar-name">Admin</span>
      <div className="admin-topbar-avatar">A</div>
    </div>
  </div>
);

export default AdminTopbar;
