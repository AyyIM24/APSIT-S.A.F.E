import React, { useState } from 'react';

// Mock users
const mockUsers = [
  { id: 1, name: 'Ayyan Muqadam', email: 'student@apsit.edu.in', rollNo: 'CS-2023-001', reports: 3, joined: '2025-08-15', suspended: false },
  { id: 2, name: 'Rahul Sharma', email: 'rahul@apsit.edu.in', rollNo: 'CS-2023-015', reports: 1, joined: '2025-08-20', suspended: false },
  { id: 3, name: 'Priya Patel', email: 'priya@apsit.edu.in', rollNo: 'IT-2023-045', reports: 2, joined: '2025-09-01', suspended: false },
  { id: 4, name: 'Amit Kumar', email: 'amit@apsit.edu.in', rollNo: 'CS-2023-032', reports: 0, joined: '2025-09-10', suspended: false },
  { id: 5, name: 'Sneha Desai', email: 'sneha@apsit.edu.in', rollNo: 'IT-2023-012', reports: 5, joined: '2025-08-10', suspended: true },
];

const AdminUsers = () => {
  const [users, setUsers] = useState(mockUsers);
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSuspend = (id) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, suspended: !u.suspended } : u
    ));
  };

  return (
    <>
      <div className="admin-page-header">
        <h2 className="admin-page-title">Registered Users ({users.length})</h2>
      </div>

      <div className="admin-search-bar">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Roll No</th>
            <th>Reports</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((user, index) => (
            <tr
              key={user.id}
              className={user.suspended ? 'suspended' : ''}
              style={{ animation: `cardReveal 0.4s ${index * 0.06}s ease both` }}
            >
              <td style={{ fontWeight: 700 }}>
                {user.name}
                {user.suspended && (
                  <span className="admin-pill rejected" style={{ marginLeft: '8px' }}>Suspended</span>
                )}
              </td>
              <td>{user.email}</td>
              <td>{user.rollNo}</td>
              <td>
                <span style={{
                  background: '#f3f0ff', color: '#764ba2', padding: '4px 12px',
                  borderRadius: '20px', fontWeight: 700, fontSize: '13px'
                }}>
                  {user.reports}
                </span>
              </td>
              <td>{user.joined}</td>
              <td>
                <button
                  className={user.suspended ? 'approve-btn' : 'reject-btn'}
                  onClick={() => toggleSuspend(user.id)}
                >
                  {user.suspended ? 'Restore' : 'Suspend'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#764ba2', fontWeight: 600 }}>
          No users found matching "{search}".
        </div>
      )}
    </>
  );
};

export default AdminUsers;
