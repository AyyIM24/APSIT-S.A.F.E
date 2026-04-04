import React, { useState, useEffect } from 'react';
import AdminShell from '../../Components/admin/AdminShell';
import api from '../../services/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSuspend = async (id) => {
    try {
      const response = await api.put(`/users/${id}/suspend`);
      setUsers(prev => prev.map(u =>
        u.id === id ? { ...u, status: response.data.user.status } : u
      ));
    } catch (err) {
      console.error("Failed to toggle suspension", err);
      alert("Failed to update user status.");
    }
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
