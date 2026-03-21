import React, { useState } from 'react';
import AdminShell from '../../Components/admin/AdminShell';

/**
 * AdminAdmins — manage admin accounts.
 * From the hand-drawn prototype, this is a dedicated page in the sidebar.
 */
const mockAdmins = [
  { id: 1, name: 'Super Admin', email: 'admin@apsit.edu.in', role: 'super', added: '2026-01-01', status: 'active' },
  { id: 2, name: 'Prof. Sharma', email: 'sharma@apsit.edu.in', role: 'admin', added: '2026-01-15', status: 'active' },
  { id: 3, name: 'Prof. Mehta', email: 'mehta@apsit.edu.in', role: 'admin', added: '2026-02-01', status: 'active' },
];

const AdminAdmins = () => {
  const [admins, setAdmins] = useState(mockAdmins);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'admin' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setAdmins(prev => [...prev, { ...formData, id: Date.now(), added: new Date().toISOString().split('T')[0], status: 'active' }]);
    setShowModal(false);
    setFormData({ name: '', email: '', role: 'admin' });
  };

  const handleRemove = (id) => {
    setAdmins(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AdminShell pageTitle="Admins">
      <div className="admin-page-header">
        <h2 className="admin-page-title">Admin Accounts ({admins.length})</h2>
        <button className="admin-add-btn" onClick={() => setShowModal(true)}>+ Add Admin</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Added</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin, index) => (
            <tr key={admin.id} style={{ animation: `cardReveal 0.4s ${index * 0.06}s ease both` }}>
              <td style={{ fontWeight: 700 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ 
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: admin.role === 'super' 
                      ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' 
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 800, fontSize: '14px'
                  }}>
                    {admin.name.charAt(0)}
                  </div>
                  {admin.name}
                </div>
              </td>
              <td>{admin.email}</td>
              <td>
                <span style={{ 
                  padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700,
                  background: admin.role === 'super' ? 'rgba(240,147,251,0.15)' : 'rgba(102,126,234,0.15)',
                  color: admin.role === 'super' ? '#f093fb' : '#667eea',
                  textTransform: 'capitalize'
                }}>
                  {admin.role === 'super' ? 'Super Admin' : 'Admin'}
                </span>
              </td>
              <td>{admin.added}</td>
              <td>
                <span className="admin-pill approved">{admin.status}</span>
              </td>
              <td>
                {admin.role !== 'super' && (
                  <button className="reject-btn" onClick={() => handleRemove(admin.id)}>
                    Remove
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Admin Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <h2 className="admin-modal-title">Add New Admin</h2>
            <form className="admin-modal-form" onSubmit={handleSubmit}>
              <div><label>Full Name</label><input type="text" name="name" required onChange={handleChange} placeholder="e.g. Prof. Kumar" /></div>
              <div><label>Email</label><input type="email" name="email" required onChange={handleChange} placeholder="e.g. kumar@apsit.edu.in" /></div>
              <div><label>Role</label>
                <select name="role" onChange={handleChange} value={formData.role}>
                  <option value="admin">Admin</option>
                  <option value="super">Super Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="submit" className="admin-add-btn" style={{ flex: 1 }}>Add Admin</button>
                <button type="button" className="export-btn" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
};

export default AdminAdmins;
