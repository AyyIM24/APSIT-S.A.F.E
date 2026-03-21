import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

/**
 * AdminShell — PRD §11.1
 * Persistent sidebar + topbar layout wrapper.
 * Every admin page wraps its content inside this component.
 */
const AdminShell = ({ pageTitle, children }) => (
  <div className="admin-shell">
    <AdminSidebar />
    <main className="admin-main-new">
      <AdminTopbar pageTitle={pageTitle} />
      {children}
    </main>
  </div>
);

export default AdminShell;
