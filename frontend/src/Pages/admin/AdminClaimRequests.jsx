import React, { useState } from 'react';
import AdminShell from '../../Components/admin/AdminShell';

const mockClaims = [
  { id: 1, itemName: 'Blue HP Laptop', claimedBy: 'Rahul Sharma', email: 'rahul@apsit.edu.in', proof: 'I lost my blue HP laptop in the library on Feb 14. It has a Batman sticker on the back and my name engraved on the bottom. Serial number: HP-2024-XXXX.', date: '2026-02-15', status: 'pending' },
  { id: 2, itemName: 'iPhone 13', claimedBy: 'Priya Patel', email: 'priya@apsit.edu.in', proof: 'This is my iPhone 13. It has a purple case with flower patterns. The lock screen wallpaper is a photo of my dog. I can provide the IMEI number.', date: '2026-02-14', status: 'pending' },
  { id: 3, itemName: 'Student ID Card', claimedBy: 'Amit Kumar', email: 'amit@apsit.edu.in', proof: 'My student ID card with roll number CS-2023-045. The card also has my library code on the back.', date: '2026-02-13', status: 'approved' },
];

const AdminClaimRequests = () => {
  const [claims, setClaims] = useState(mockClaims);
  const [filter, setFilter] = useState('all');
  const [drawerClaim, setDrawerClaim] = useState(null);

  const filtered = filter === 'all' ? claims : claims.filter(c => c.status === filter);

  const handleAction = (id, action) => {
    setClaims(prev => prev.map(c =>
      c.id === id ? { ...c, status: action } : c
    ));
    if (drawerClaim && drawerClaim.id === id) {
      setDrawerClaim(null);
    }
  };

  return (
    <AdminShell pageTitle="Claim Requests">
      <div className="admin-page-header">
        <h2 className="admin-page-title">Claim Requests</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? 'admin-add-btn' : 'export-btn'}
              style={{ padding: '8px 18px', fontSize: '13px', textTransform: 'capitalize' }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Claimed By</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((claim, index) => (
            <tr key={claim.id} style={{ animation: `cardReveal 0.4s ${index * 0.06}s ease both` }}>
              <td style={{ fontWeight: 700 }}>{claim.itemName}</td>
              <td>
                <div>{claim.claimedBy}</div>
                <div style={{ fontSize: '12px', color: '#764ba2' }}>{claim.email}</div>
              </td>
              <td>{claim.date}</td>
              <td>
                <span className={`admin-pill ${claim.status}`}>{claim.status}</span>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {claim.status === 'pending' && (
                    <>
                      <button className="approve-btn" onClick={() => handleAction(claim.id, 'approved')}>✅ Approve</button>
                      <button className="reject-btn" onClick={() => handleAction(claim.id, 'rejected')}>❌ Reject</button>
                    </>
                  )}
                  <button
                    className="export-btn"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                    onClick={() => setDrawerClaim(claim)}
                  >
                    View Proof
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#764ba2', fontWeight: 600 }}>
          No claims match this filter.
        </div>
      )}

      {/* Proof Side Drawer */}
      {drawerClaim && (
        <>
          <div className="proof-drawer-overlay" onClick={() => setDrawerClaim(null)} />
          <div className="proof-drawer">
            <div className="proof-drawer-header">
              <h3 className="proof-drawer-title">Claim Proof</h3>
              <button className="proof-drawer-close" onClick={() => setDrawerClaim(null)}>✕</button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#764ba2', fontWeight: 700, textTransform: 'uppercase' }}>Item</label>
              <p style={{ color: '#120058', fontWeight: 700, fontSize: '1.1rem' }}>{drawerClaim.itemName}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#764ba2', fontWeight: 700, textTransform: 'uppercase' }}>Claimed By</label>
              <p style={{ color: '#120058', fontWeight: 600 }}>{drawerClaim.claimedBy}</p>
              <p style={{ color: '#764ba2', fontSize: '14px' }}>{drawerClaim.email}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#764ba2', fontWeight: 700, textTransform: 'uppercase' }}>Date Submitted</label>
              <p style={{ color: '#120058' }}>{drawerClaim.date}</p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#764ba2', fontWeight: 700, textTransform: 'uppercase' }}>Proof Statement</label>
              <div style={{
                background: '#fdfbff', border: '1px solid #f3f0ff', borderRadius: '12px',
                padding: '16px', marginTop: '8px', color: '#120058', lineHeight: '1.6'
              }}>
                {drawerClaim.proof}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#764ba2', fontWeight: 700, textTransform: 'uppercase' }}>Status</label>
              <span className={`admin-pill ${drawerClaim.status}`} style={{ marginLeft: '8px' }}>{drawerClaim.status}</span>
            </div>

            {drawerClaim.status === 'pending' && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button className="approve-btn" style={{ flex: 1, padding: '12px' }} onClick={() => handleAction(drawerClaim.id, 'approved')}>
                  ✅ Approve
                </button>
                <button className="reject-btn" style={{ flex: 1, padding: '12px' }} onClick={() => handleAction(drawerClaim.id, 'rejected')}>
                  ❌ Reject
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </AdminShell>
  );
};

export default AdminClaimRequests;
