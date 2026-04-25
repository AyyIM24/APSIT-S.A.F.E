import React, { useState, useEffect } from 'react';
import AdminShell from '../../Components/admin/AdminShell';
import api from '../../services/api';

const AdminHandedOverItems = () => {
  const [handedOverItems, setHandedOverItems] = useState([]);
  const [detailsModal, setDetailsModal] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchHandedOverItems = async () => {
    try {
      const response = await api.get('/claims/handed-over');
      setHandedOverItems(response.data.items || []);
    } catch (err) {
      console.error("Failed to load handed-over items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHandedOverItems();
  }, []);

  const downloadReport = () => {
    if (handedOverItems.length === 0) {
      alert('No handed-over items to export');
      return;
    }

    let csv = 'Item Name,Category,Location,Handed Over To,Email,Handed Over Date,Item Reported Date,Status\n';
    handedOverItems.forEach(claim => {
      const handoverDate = claim.pickedUpAt ? new Date(claim.pickedUpAt).toLocaleDateString() : 'N/A';
      const itemReportDate = claim.item.createdAt ? new Date(claim.item.createdAt).toLocaleDateString() : 'N/A';
      csv += `"${claim.item?.itemName || 'Unknown'}","${claim.item?.category || 'N/A'}","${claim.item?.location || 'N/A'}","${claim.claimedByName}","${claim.email}","${handoverDate}","${itemReportDate}","Resolved"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `handed-over-items-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminShell pageTitle="Handed Over Items">
      <div className="admin-page-header">
        <h2 className="admin-page-title">Handed Over Items (Resolved Cases)</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={downloadReport}
            className="admin-add-btn"
            style={{ padding: '8px 18px', fontSize: '13px' }}
          >
            📊 Export Report
          </button>
          <button 
            onClick={fetchHandedOverItems}
            className="export-btn"
            style={{ padding: '8px 18px', fontSize: '13px' }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#764ba2' }}>
          Loading handed-over items...
        </div>
      ) : (
        <>
          <div style={{
            background: '#f0e6ff',
            border: '1px solid #e0c9ff',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            color: '#120058'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#764ba2', fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Items Handed Over
                </p>
                <p style={{ margin: '8px 0 0 0', fontSize: '28px', fontWeight: 700 }}>
                  {handedOverItems.length}
                </p>
              </div>
              <div style={{ textAlign: 'right', fontSize: '13px' }}>
                <p style={{ margin: 0, color: '#764ba2' }}>All resolved and picked up by rightful claimants</p>
              </div>
            </div>
          </div>

          {handedOverItems.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px', 
              color: '#764ba2', 
              fontWeight: 600,
              background: '#fdfbff',
              borderRadius: '12px',
              border: '1px solid #f3f0ff'
            }}>
              <p style={{ fontSize: '18px', margin: '0 0 8px 0' }}>📭 No handed-over items yet</p>
              <p style={{ fontSize: '13px', margin: 0, color: '#999' }}>Items will appear here once admins confirm pickup via QR code scanning</p>
            </div>
          ) : (
            <div className="admin-grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
              {handedOverItems.map((claim, index) => (
                <div
                  key={claim.id}
                  style={{
                    background: '#fff',
                    border: '1px solid #e9e0f5',
                    borderRadius: '12px',
                    padding: '20px',
                    animation: `cardReveal 0.4s ${index * 0.06}s ease both`,
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(118, 75, 162, 0.08)'
                  }}
                  onClick={() => setDetailsModal(claim)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(118, 75, 162, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(118, 75, 162, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ marginBottom: '12px' }}>
                    <h3 style={{ margin: '0 0 4px 0', color: '#120058', fontWeight: 700, fontSize: '16px' }}>
                      {claim.item?.itemName || 'Unknown Item'}
                    </h3>
                    <div style={{ fontSize: '12px', color: '#764ba2', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span>📁 {claim.item?.category || 'N/A'}</span>
                      <span>📍 {claim.item?.location || 'N/A'}</span>
                    </div>
                  </div>

                  <div style={{
                    background: '#f9f7ff',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '12px',
                    borderLeft: '4px solid #764ba2'
                  }}>
                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#764ba2', fontWeight: 700, textTransform: 'uppercase' }}>
                      Handed Over To
                    </p>
                    <p style={{ margin: '0', color: '#120058', fontWeight: 600 }}>{claim.claimedByName}</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#764ba2' }}>{claim.email}</p>
                  </div>

                  <div style={{
                    fontSize: '12px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <span style={{ color: '#764ba2', fontWeight: 700 }}>📅 Handed Over</span>
                      <p style={{ margin: '4px 0 0 0', color: '#120058' }}>
                        {claim.pickedUpAt ? new Date(claim.pickedUpAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <span style={{ color: '#764ba2', fontWeight: 700 }}>🕐 Time</span>
                      <p style={{ margin: '4px 0 0 0', color: '#120058' }}>
                        {claim.pickedUpAt ? new Date(claim.pickedUpAt).toLocaleTimeString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '12px',
                    borderTop: '1px solid #eee'
                  }}>
                    <span className="admin-pill approved" style={{ fontSize: '11px', padding: '6px 12px' }}>
                      ✅ RESOLVED
                    </span>
                    <button
                      className="export-btn"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailsModal(claim);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Details Modal */}
      {detailsModal && (
        <>
          <div 
            className="proof-drawer-overlay" 
            onClick={() => setDetailsModal(null)} 
          />
          <div className="proof-drawer">
            <div className="proof-drawer-header">
              <h3 className="proof-drawer-title">Handed Over Item Details</h3>
              <button className="proof-drawer-close" onClick={() => setDetailsModal(null)}>✕</button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#764ba2', fontWeight: 700, textTransform: 'uppercase' }}>
                Item Name
              </label>
              <p style={{ color: '#120058', fontWeight: 700, fontSize: '1.1rem', margin: '8px 0 0 0' }}>
                {detailsModal.item?.itemName || 'Unknown'}
              </p>
            </div>

            <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#764ba2', fontWeight: 700, textTransform: 'uppercase' }}>
                  Category
                </label>
                <p style={{ color: '#120058', margin: '8px 0 0 0' }}>{detailsModal.item?.category || 'N/A'}</p>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#764ba2', fontWeight: 700, textTransform: 'uppercase' }}>
                  Location
                </label>
                <p style={{ color: '#120058', margin: '8px 0 0 0' }}>{detailsModal.item?.location || 'N/A'}</p>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#764ba2', fontWeight: 700, textTransform: 'uppercase' }}>
                Item Reported Date
              </label>
              <p style={{ color: '#120058', margin: '8px 0 0 0' }}>
                {detailsModal.item?.createdAt 
                  ? new Date(detailsModal.item.createdAt).toLocaleDateString() 
                  : 'N/A'}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', color: '#764ba2', fontWeight: 700, textTransform: 'uppercase' }}>
                Item Description
              </label>
              <div style={{
                background: '#fdfbff', 
                border: '1px solid #f3f0ff', 
                borderRadius: '8px',
                padding: '12px', 
                marginTop: '8px', 
                color: '#120058', 
                lineHeight: '1.6',
                fontSize: '14px'
              }}>
                {detailsModal.item?.description || 'No description provided'}
              </div>
            </div>

            <div style={{ 
              background: '#f0e6ff',
              border: '1px solid #e0c9ff',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <label style={{ fontSize: '12px', color: '#764ba2', fontWeight: 700, textTransform: 'uppercase' }}>
                Handed Over To (Claimant)
              </label>
              <p style={{ color: '#120058', fontWeight: 700, margin: '8px 0 4px 0', fontSize: '1rem' }}>
                {detailsModal.claimedByName}
              </p>
              <p style={{ color: '#764ba2', fontSize: '14px', margin: 0 }}>
                📧 {detailsModal.email}
              </p>
            </div>

            <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#764ba2', fontWeight: 700, textTransform: 'uppercase' }}>
                  Claim Submitted
                </label>
                <p style={{ color: '#120058', margin: '8px 0 0 0' }}>
                  {detailsModal.createdAt ? new Date(detailsModal.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#764ba2', fontWeight: 700, textTransform: 'uppercase' }}>
                  Status
                </label>
                <p style={{ color: '#120058', margin: '8px 0 0 0', fontWeight: 600 }}>
                  ✅ Approved
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#764ba2', fontWeight: 700, textTransform: 'uppercase' }}>
                  Handed Over Date
                </label>
                <p style={{ color: '#120058', margin: '8px 0 0 0', fontWeight: 700 }}>
                  {detailsModal.pickedUpAt ? new Date(detailsModal.pickedUpAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#764ba2', fontWeight: 700, textTransform: 'uppercase' }}>
                  Handed Over Time
                </label>
                <p style={{ color: '#120058', margin: '8px 0 0 0', fontWeight: 700 }}>
                  {detailsModal.pickedUpAt ? new Date(detailsModal.pickedUpAt).toLocaleTimeString() : 'N/A'}
                </p>
              </div>
            </div>

            <div style={{
              background: '#e8f5e9',
              border: '1px solid #c8e6c9',
              borderRadius: '8px',
              padding: '12px',
              color: '#1b5e20',
              fontSize: '13px'
            }}>
              ✅ Item has been successfully resolved and handed over to the claimant. This record is kept for administrative purposes.
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
};

export default AdminHandedOverItems;
