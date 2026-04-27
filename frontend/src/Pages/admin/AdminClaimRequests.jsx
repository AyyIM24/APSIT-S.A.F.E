import React, { useState, useEffect } from 'react';
import AdminShell from '../../Components/admin/AdminShell';
import api, { getImageUrl } from '../../services/api';

const AdminClaimRequests = () => {
  const [claims, setClaims] = useState([]);
  const [filter, setFilter] = useState('all');
  const [drawerClaim, setDrawerClaim] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchClaims = async () => {
    try {
      const response = await api.get('/claims');
      setClaims(response.data);
    } catch (err) {
      console.error("Failed to load claims", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const filtered = filter === 'all' ? claims : claims.filter(c => c.status.toLowerCase() === filter);

  const handleAction = async (id, action) => {
    try {
      if (action === 'approved') {
        await api.put(`/claims/${id}/approve`);
      } else {
        await api.put(`/claims/${id}/reject`);
      }
      
      // Update local state temporarily
      setClaims(prev => prev.map(c =>
        c.id === id ? { ...c, status: action } : c
      ));
      
      if (drawerClaim && drawerClaim.id === id) {
        setDrawerClaim(null);
      }
    } catch (err) {
      console.error("Action failed", err);
      alert("Failed to update claim status");
    }
  };

  // Helper to render a person info card in the drawer
  const renderPersonCard = (label, icon, person, accentColor) => {
    if (!person) {
      return (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', color: accentColor, fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {icon} {label}
          </label>
          <p style={{ color: '#999', fontStyle: 'italic', fontSize: '13px', marginTop: '6px' }}>Not available</p>
        </div>
      );
    }
    return (
      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '12px', color: accentColor, fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {icon} {label}
        </label>
        <div style={{
          background: '#fdfbff', border: `1px solid ${accentColor}22`, borderRadius: '12px',
          padding: '14px', marginTop: '8px'
        }}>
          <p style={{ color: '#120058', fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{person.name}</p>
          <p style={{ color: '#764ba2', fontSize: '13px', marginBottom: '2px' }}>📧 {person.email}</p>
          {person.phone && <p style={{ color: '#555', fontSize: '13px', marginBottom: '2px' }}>📱 {person.phone}</p>}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
            {person.branch && <span style={{ color: '#888', fontSize: '12px' }}>🏫 {person.branch}</span>}
            {person.year && <span style={{ color: '#888', fontSize: '12px' }}>📅 Year {person.year}</span>}
            {person.rollNo && <span style={{ color: '#888', fontSize: '12px' }}>🆔 {person.rollNo}</span>}
          </div>
        </div>
      </div>
    );
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
            <th>Type</th>
            <th>Claimed By</th>
            <th>Reporter / Finder</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((claim, index) => {
            const item = claim.item;
            const isFoundItem = item?.type?.toUpperCase() === 'FOUND';
            const lostReporter = item?.linkedLostItem?.reportedBy;
            const foundBy = isFoundItem ? item?.reportedBy : null;
            
            return (
              <tr key={claim.id} style={{ animation: `cardReveal 0.4s ${index * 0.06}s ease both` }}>
                <td style={{ fontWeight: 700 }}>{item?.itemName || 'Unknown'}</td>
                <td>
                  <span style={{
                    background: isFoundItem 
                      ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                      : 'linear-gradient(135deg, #e74c3c, #c0392b)',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '8px'
                  }}>
                    {item?.type || '—'}
                  </span>
                </td>
                <td>
                  <div>{claim.claimedByName || claim.claimedBy?.name}</div>
                  <div style={{ fontSize: '12px', color: '#764ba2' }}>{claim.email}</div>
                </td>
                <td>
                  {isFoundItem ? (
                    <div>
                      {lostReporter && (
                        <div style={{ fontSize: '12px', marginBottom: '2px' }}>
                          <span style={{ color: '#e74c3c', fontWeight: 600 }}>Lost:</span> {lostReporter.name}
                        </div>
                      )}
                      <div style={{ fontSize: '12px' }}>
                        <span style={{ color: '#667eea', fontWeight: 600 }}>Found:</span> {foundBy?.name || '—'}
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      Reported by: {item?.reportedBy?.name || '—'}
                    </div>
                  )}
                </td>
                <td>{claim.createdAt ? new Date(claim.createdAt).toLocaleDateString() : 'N/A'}</td>
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
                      View Details
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px', color: '#764ba2', fontWeight: 600 }}>
          No claims match this filter.
        </div>
      )}

      {/* ===== ENRICHED DETAIL DRAWER ===== */}
      {drawerClaim && (
        <>
          <div className="proof-drawer-overlay" onClick={() => setDrawerClaim(null)} />
          <div className="proof-drawer" style={{ maxWidth: '480px', overflowY: 'auto' }}>
            <div className="proof-drawer-header">
              <h3 className="proof-drawer-title">Claim Details</h3>
              <button className="proof-drawer-close" onClick={() => setDrawerClaim(null)}>✕</button>
            </div>

            {/* ── SECTION 1: Item Details ── */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', color: '#764ba2', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                📦 Item Details
              </label>
              <div style={{
                background: '#fdfbff', border: '1px solid #f3f0ff', borderRadius: '12px',
                padding: '14px', marginTop: '8px'
              }}>
                {drawerClaim.item?.imageUrl && (
                  <img 
                    src={getImageUrl(drawerClaim.item.imageUrl)} 
                    alt={drawerClaim.item?.itemName}
                    style={{ 
                      width: '100%', maxHeight: '180px', objectFit: 'cover', 
                      borderRadius: '10px', marginBottom: '12px' 
                    }}
                  />
                )}
                <p style={{ color: '#120058', fontWeight: 700, fontSize: '1.1rem', marginBottom: '6px' }}>
                  {drawerClaim.item?.itemName}
                </p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  <span style={{
                    background: drawerClaim.item?.type === 'FOUND' 
                      ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                      : 'linear-gradient(135deg, #e74c3c, #c0392b)',
                    color: 'white', fontSize: '11px', fontWeight: 700,
                    padding: '3px 10px', borderRadius: '8px'
                  }}>
                    {drawerClaim.item?.type}
                  </span>
                  <span style={{
                    background: '#f3f0ff', color: '#764ba2', fontSize: '11px', fontWeight: 600,
                    padding: '3px 10px', borderRadius: '8px'
                  }}>
                    {drawerClaim.item?.category}
                  </span>
                </div>
                <p style={{ color: '#555', fontSize: '13px', marginBottom: '3px' }}>📍 {drawerClaim.item?.location}</p>
                <p style={{ color: '#555', fontSize: '13px', marginBottom: '3px' }}>📅 {drawerClaim.item?.date}</p>
                {drawerClaim.item?.description && (
                  <p style={{ color: '#777', fontSize: '13px', lineHeight: '1.5', marginTop: '8px', borderTop: '1px solid #f0ecff', paddingTop: '8px' }}>
                    {drawerClaim.item.description}
                  </p>
                )}
              </div>
            </div>

            {/* ── SECTION 2: Lost Reporter (who originally reported the item as lost) ── */}
            {drawerClaim.item?.type === 'FOUND' && drawerClaim.item?.linkedLostItem && (
              renderPersonCard(
                'Lost Reporter (Original Owner)',
                '🔴',
                drawerClaim.item.linkedLostItem.reportedBy,
                '#e74c3c'
              )
            )}

            {/* ── SECTION 3: Found By (who reported the found item) ── */}
            {drawerClaim.item?.type === 'FOUND' && (
              renderPersonCard(
                'Found By',
                '🟢',
                drawerClaim.item.reportedBy,
                '#28a745'
              )
            )}

            {/* ── For LOST items, show who reported it ── */}
            {drawerClaim.item?.type === 'LOST' && (
              renderPersonCard(
                'Reported By',
                '📋',
                drawerClaim.item.reportedBy,
                '#764ba2'
              )
            )}

            {/* ── SECTION 4: Claimed By ── */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#f39c12', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🙋 Claimed By
              </label>
              <div style={{
                background: '#fdfbff', border: '1px solid #fde8c8', borderRadius: '12px',
                padding: '14px', marginTop: '8px'
              }}>
                <p style={{ color: '#120058', fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>
                  {drawerClaim.claimedByName || drawerClaim.claimedBy?.name}
                </p>
                <p style={{ color: '#764ba2', fontSize: '13px' }}>📧 {drawerClaim.email}</p>
                {drawerClaim.claimedBy?.phone && (
                  <p style={{ color: '#555', fontSize: '13px' }}>📱 {drawerClaim.claimedBy.phone}</p>
                )}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
                  {drawerClaim.claimedBy?.branch && <span style={{ color: '#888', fontSize: '12px' }}>🏫 {drawerClaim.claimedBy.branch}</span>}
                  {drawerClaim.claimedBy?.year && <span style={{ color: '#888', fontSize: '12px' }}>📅 Year {drawerClaim.claimedBy.year}</span>}
                  {drawerClaim.claimedBy?.rollNo && <span style={{ color: '#888', fontSize: '12px' }}>🆔 {drawerClaim.claimedBy.rollNo}</span>}
                </div>
              </div>
            </div>

            {/* ── SECTION 5: Proof Statement ── */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#764ba2', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                📝 Proof Statement
              </label>
              <div style={{
                background: '#fdfbff', border: '1px solid #f3f0ff', borderRadius: '12px',
                padding: '16px', marginTop: '8px', color: '#120058', lineHeight: '1.6'
              }}>
                {drawerClaim.proof}
              </div>
            </div>

            {/* ── Date & Status ── */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#764ba2', fontWeight: 700, textTransform: 'uppercase' }}>Date Submitted</label>
                <p style={{ color: '#120058', marginTop: '4px' }}>{drawerClaim.createdAt ? new Date(drawerClaim.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#764ba2', fontWeight: 700, textTransform: 'uppercase' }}>Status</label>
                <div style={{ marginTop: '4px' }}>
                  <span className={`admin-pill ${drawerClaim.status}`}>{drawerClaim.status}</span>
                </div>
              </div>
            </div>

            {/* ── Action Buttons ── */}
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
