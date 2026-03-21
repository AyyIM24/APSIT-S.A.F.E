import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const mockItems = [
  { id: 1, name: "Blue HP Laptop", status: "LOST", category: "electronics", location: "Library 2nd Floor", date: "2026-02-14", description: "Blue HP Pavilion laptop with APSIT sticker on lid. Was left on a desk near the window.", type: "lost", image: "/images/Img 1.jpg" },
  { id: 2, name: "iPhone 13", status: "FOUND", category: "electronics", location: "Canteen", date: "2026-02-13", description: "White iPhone 13 found near the food counter. Has a transparent case with dried flowers.", type: "found", image: "/images/Img 2.jpg" },
  { id: 3, name: "APSIT ID Card", status: "LOST", category: "id-cards", location: "Lab 402", date: "2026-02-12", description: "Student ID card for IT department. Name partially visible.", type: "lost", image: "" },
  { id: 4, name: "Blue Umbrella", status: "FOUND", category: "others", location: "Main Gate", date: "2026-02-11", description: "Blue foldable umbrella found near the main gate security cabin.", type: "found", image: "" },
  { id: 5, name: "Data Structures Notes", status: "LOST", category: "books", location: "Seminar Hall", date: "2026-02-10", description: "Handwritten DS notes, about 50 pages, spiral bound. Has name written inside.", type: "lost", image: "" },
  { id: 6, name: "Calculator", status: "FOUND", category: "electronics", location: "Lab 401", date: "2026-02-09", description: "Casio scientific calculator found in Lab 401 after the exam.", type: "found", image: "" },
];

const categoryEmoji = {
  electronics: '💻', 'id-cards': '🪪', books: '📚', bags: '🎒',
  accessories: '⌚', keys: '🔑', others: '📦', other: '👓'
};

const ItemDetail = ({ isLoggedIn, setIsLoggedIn }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = mockItems.find(i => i.id === parseInt(id));

  // Claim flow states
  const [claimStatus, setClaimStatus] = useState('none');
  // 'none' | 'pending' | 'approved' | 'rejected'
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [proof, setProof] = useState('');

  if (!item) {
    return (
      <div className="report-root">
        <main className="report-container">
          <div className="report-form-box" style={{ textAlign: 'center' }}>
            <h2>Item Not Found</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>This item doesn't exist or has been removed.</p>
          </div>
        </main>
      </div>
    );
  }

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    console.log("Claim submitted for item:", item.id, "Proof:", proof);
    setShowClaimModal(false);
    setClaimStatus('pending');

    // AUTO-APPROVE AFTER 3 SECONDS — TESTING ONLY
    // In production, remove this timeout.
    // QR should only appear after Admin clicks Approve in AdminClaimRequests.
    setTimeout(() => {
      setClaimStatus('approved');
    }, 3000);
  };

  const handleDownloadQR = () => {
    const svg = document.querySelector('.qr-wrapper svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = 250; canvas.height = 250;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 250, 250);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `item-${item.id}-qr.png`;
        a.click();
        URL.revokeObjectURL(url);
      });
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const isLost = item.type === 'lost';

  return (
    <div className="report-root">
      <main className="item-detail-page">
        <div className="item-detail-card anim-cardReveal">
          {/* Image Section */}
          <div className="item-detail-image">
            {item.image ? (
              <img src={item.image} alt={item.name} />
            ) : (
              <div className="item-detail-emoji-placeholder">
                {categoryEmoji[item.category] || '📦'}
              </div>
            )}
            <span className={`item-detail-status-badge ${item.status.toLowerCase()}`}>
              {item.status}
            </span>
          </div>

          {/* Info Section */}
          <div className="item-detail-info">
            <h1>{item.name}</h1>

            <div className="item-detail-meta-grid">
              <div className="meta-box">
                <span className="meta-label">📍 Location</span>
                <span className="meta-value">{item.location}</span>
              </div>
              <div className="meta-box">
                <span className="meta-label">📅 Date</span>
                <span className="meta-value">{item.date}</span>
              </div>
              <div className="meta-box">
                <span className="meta-label">🏷️ Category</span>
                <span className="meta-value">{categoryEmoji[item.category]} {item.category}</span>
              </div>
              <div className="meta-box">
                <span className="meta-label">📋 Type</span>
                <span className="meta-value" style={{ textTransform: 'capitalize' }}>{item.type} Item</span>
              </div>
            </div>

            <div className="item-detail-desc">
              <h4>Description</h4>
              <p>{item.description}</p>
            </div>

            {/* === ACTION AREA — depends on item type and claim state === */}
            <div className="item-action-area">

              {/* FOUND items → show "Claim This Item" flow */}
              {!isLost && (
                <>
                  {claimStatus === 'none' && (
                    <button className="claim-btn anim-singlePulse" onClick={() => setShowClaimModal(true)}>
                      🎁 Claim This Item
                    </button>
                  )}

                  {claimStatus === 'pending' && (
                    <div className="claim-pending-state">
                      <div className="pending-spinner">⏳</div>
                      <h4>Claim Under Review</h4>
                      <p>The Admin is verifying your proof. You'll be notified once approved.</p>
                    </div>
                  )}

                  {claimStatus === 'approved' && (
                    <div className="claim-approved-state">
                      <h4>✅ Claim Approved!</h4>
                      <p>Show this QR code at the Security Desk to collect your item.</p>
                      <div className="qr-wrapper">
                        <QRCodeSVG
                          value={`https://apsit-safe.edu.in/pickup/${item.id}`}
                          size={200}
                          fgColor="#120058"
                          bgColor="#ffffff"
                        />
                      </div>
                      <p style={{ fontSize: '12px', color: '#155724', marginTop: '8px' }}>
                        {item.name} · {item.location}
                      </p>
                      <div className="qr-actions">
                        <button className="btn-gradient-card" onClick={() => window.print()}>🖨️ Print</button>
                        <button className="btn-gradient-card" onClick={handleDownloadQR}>⬇️ Save as Image</button>
                      </div>
                    </div>
                  )}

                  {claimStatus === 'rejected' && (
                    <div className="claim-rejected-state">
                      <h4>❌ Claim Not Approved</h4>
                      <p>Your proof didn't match. You may try again with better details.</p>
                      <button className="claim-btn" onClick={() => {
                        setClaimStatus('none');
                        setProof('');
                        setShowClaimModal(true);
                      }}>
                        🔄 Try Again
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* LOST items → show "I Found This Item!" button */}
              {isLost && (
                <button className="found-item-btn" onClick={() => navigate('/found')}>
                  🔍 I Found This Item!
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Claim Proof Modal */}
        {showClaimModal && (
          <div className="modal-overlay" onClick={() => setShowClaimModal(false)}>
            <div className="modal-content-aesthetic" onClick={e => e.stopPropagation()}>
              <h2>Submit <span>Proof of Ownership</span></h2>
              <p>To prevent fraud, describe something only the real owner would know about this item:</p>
              <form onSubmit={handleClaimSubmit}>
                <textarea
                  value={proof}
                  onChange={e => setProof(e.target.value)}
                  placeholder='e.g. "My lock screen wallpaper is a photo of my dog, and there is a Thane sticker on the back lid"'
                  required
                  rows={4}
                />
                <div className="modal-btns">
                  <button type="button" className="cancel-btn" onClick={() => setShowClaimModal(false)}>Cancel</button>
                  <button type="submit" className="submit-btn-gradient">Submit Claim</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ItemDetail;