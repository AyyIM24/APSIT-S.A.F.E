import React, { useState } from 'react';
import AdminShell from '../../Components/admin/AdminShell';

const mockUsers = [
  { id: 1, name: 'Ayyan Muqadam', email: 'ayyan@apsit.edu.in', rollNo: 'IT-2024-001', reports: 3, joined: '2026-01-10', status: 'active' },
  { id: 2, name: 'Rahul Sharma', email: 'rahul@apsit.edu.in', rollNo: 'CS-2023-045', reports: 1, joined: '2026-01-12', status: 'active' },
  { id: 3, name: 'Priya Patel', email: 'priya@apsit.edu.in', rollNo: 'EC-2024-022', reports: 2, joined: '2026-01-15', status: 'active' },
  { id: 4, name: 'Amit Kumar', email: 'amit@apsit.edu.in', rollNo: 'ME-2023-018', reports: 0, joined: '2026-02-01', status: 'active' },
  { id: 5, name: 'Bishnupriya Mohapatra', email: 'bishnupriya@apsit.edu.in', rollNo: 'IT-2024-008', reports: 4, joined: '2026-01-08', status: 'active' },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleSuspend = (id) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' } : u
    ));
  };

  return (
    <AdminShell pageTitle="Users">
      <div className="admin-page-header">
        <h2 className="admin-page-title">Registered Users ({users.length})</h2>
        <div className="admin-search-bar">
          <input
            type="text"
            placeholder="🔍 Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Roll No</th>
            <th>Reports</th>
            <th>Joined</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr
              key={user.id}
              style={{
                animation: `cardReveal 0.4s ${index * 0.06}s ease both`,
                background: user.status === 'suspended' ? 'rgba(255,0,0,0.03)' : undefined,
              }}
            >
              <td style={{ fontWeight: 700 }}>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.rollNo}</td>
              <td>
                <span style={{ background: '#f3f0ff', color: '#764ba2', padding: '4px 12px', borderRadius: '8px', fontWeight: 700 }}>
                  {user.reports}
                </span>
              </td>
              <td>{user.joined}</td>
              <td>
                <span className={`admin-pill ${user.status === 'active' ? 'approved' : 'rejected'}`}>
                  {user.status}
                </span>
              </td>
              <td>
                <button
                  className={user.status === 'suspended' ? 'approve-btn' : 'reject-btn'}
                  onClick={() => handleSuspend(user.id)}
                >
                  {user.status === 'suspended' ? '✅ Activate' : '🚫 Suspend'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredUsers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#764ba2', fontWeight: 600 }}>
          No users found matching your search.
        </div>
      )}
    </AdminShell>
  );
};

export default AdminUsers;
