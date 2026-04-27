import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import api, { authService, getImageUrl } from '../services/api';

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i) => {
    const delay = 0.2 + i * 0.5;
    return {
      pathLength: 1,
      opacity: 1,
      transition: { pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 }, opacity: { delay, duration: 0.01 } }
    };
  }
};

const categoryEmoji = {
  electronics: '💻', 'id-cards': '🪪', books: '📚', bags: '🎒',
  accessories: '⌚', keys: '🔑', others: '📦', other: '👓'
};

const ItemDetail = ({ isLoggedIn, setIsLoggedIn }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // Claim flow states
  const [claimStatus, setClaimStatus] = useState('none');
  // 'none' | 'pending' | 'approved' | 'rejected'
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [proof, setProof] = useState('');
  const [myClaim, setMyClaim] = useState(null);

  useEffect(() => {
    const fetchItemAndClaims = async () => {
      try {
        const itemRes = await api.get(`/items/${id}`);
        setItem(itemRes.data);
      } catch (err) {
        console.error("Failed to fetch item", err);
      }

      try {
        if (authService.isAuthenticated()) {
          const claimsRes = await api.get('/claims/my-claims');
          const fetchedClaim = claimsRes.data.find(c => c.item?.id === Number(id) || c.itemId === Number(id));
          if (fetchedClaim) {
            setClaimStatus(fetchedClaim.status?.toLowerCase() || 'pending');
            setMyClaim(fetchedClaim);
          }
        }
      } catch (err) {
        console.error("Failed to fetch claims", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItemAndClaims();
  }, [id]);

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', fontSize: '2rem' }}>Loading details...</div>;
  }

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

  const handleClaimSubmit = async (e) => {
    e.preventDefault();
    setShowClaimModal(false);
    setClaimStatus('pending');

    try {
      const user = authService.getUser() || {};
      const response = await api.post(`/claims`, {
        itemId: item.id,
        proof: proof,
        claimedByName: user.name || "Student",
        email: user.email || "student@apsit.edu.in"
      });
      console.log("Claim submitted successfully", response.data);
      // Wait for admin approval. We could set up polling or just tell user to wait.
      // For testing, let's keep it pending.
    } catch (err) {
      console.error("Failed to submit claim", err);
      setClaimStatus('rejected');
    }
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

  const isLost = item.type?.toLowerCase() === 'lost';
  const isStatusLost = item.status?.toUpperCase() === 'LOST';
  const isStatusFound = ['FOUND', 'SECURED'].includes(item.status?.toUpperCase());
  const currentUser = authService.getUser();
  const isAdmin = authService.isAdmin();
  const currentUserId = currentUser?.userId ? Number(currentUser.userId) : null;
  const isReporter = currentUserId && item.reportedBy?.id === currentUserId;
  const canResolve = isReporter || isAdmin;

  // Check if the current user is the one who found/reported this found item
  const isFinderOfFoundItem = currentUserId
    && item.type?.toUpperCase() === 'FOUND' 
    && item.reportedBy?.id === currentUserId;

  const handleMarkFound = async () => {
    if (window.confirm("Are you sure you want to mark this item as Found? It will move to the Found section and be removed from Lost listings.")) {
      try {
        await api.put(`/items/${item.id}/status`, { status: 'FOUND' });
        alert("Item marked as found successfully! It will now appear in the Found section.");
        navigate('/discovery');
      } catch(err) {
        alert("Failed to update status: " + (err.response?.data?.error || err.message));
      }
    }
  };

  return (
    <div className="report-root">
      <main className="item-detail-page">
        <div className="item-detail-card anim-cardReveal">
          {/* Image Section */}
          <div className="item-detail-image">
            {item.imageUrl ? (
              <img src={getImageUrl(item.imageUrl)} alt={item.itemName} />
            ) : (
              <div className="item-detail-emoji-placeholder">
                {categoryEmoji[item.category] || '📦'}
              </div>
            )}
            <span className={`item-detail-status-badge ${item.status?.toLowerCase()}`}>
              {item.status}
            </span>
          </div>

          {/* Info Section */}
          <div className="item-detail-info">
            <h1>{item.itemName}</h1>

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
                <span className="meta-label">📋 Status</span>
                <span className="meta-value" style={{ textTransform: 'capitalize' }}>{item.status} Item</span>
              </div>
            </div>

            <div className="item-detail-desc">
              <h4>Description</h4>
              <p>{item.description}</p>
            </div>

            {/* === ACTION AREA — depends on item type and claim state === */}
            <div className="item-action-area" style={{ position: 'relative', minHeight: '150px' }}>

              {/* Items with status FOUND or SECURED → show "Claim This Item" flow */}
              {isStatusFound && (
                <>
                  {/* If current user is the finder, show info message instead of claim button */}
                  {isFinderOfFoundItem ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        background: 'linear-gradient(135deg, rgba(102,126,234,0.15), rgba(118,75,162,0.15))',
                        border: '1px solid rgba(102,126,234,0.3)',
                        borderRadius: '16px',
                        padding: '24px',
                        textAlign: 'center'
                      }}
                    >
                      <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🙏</div>
                      <h4 style={{ color: '#667eea', marginBottom: '8px', fontSize: '1.1rem' }}>Thank You for Finding This Item!</h4>
                      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: '1.6' }}>
                        The rightful owner has been notified. They will submit a claim and the admin will verify their identity before handing over the item.
                      </p>
                    </motion.div>
                  ) : (
                    <AnimatePresence mode="wait">
                      {claimStatus === 'none' && (
                        <motion.div 
                            key="none"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                          <button className="claim-btn anim-singlePulse" onClick={() => setShowClaimModal(true)}>
                            🎁 Claim This Item
                          </button>
                        </motion.div>
                      )}

                      {claimStatus === 'pending' && (
                        <motion.div 
                            key="pending"
                            className="claim-pending-state"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="pending-spinner">⏳</motion.div>
                          <h4>Claim Under Review</h4>
                          <p>The Admin is verifying your proof. You'll be notified once approved.</p>
                        </motion.div>
                      )}

                      {claimStatus === 'approved' && (
                        <motion.div 
                            key="approved"
                            className="claim-approved-state"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        >
                          <motion.svg
                            width="80" height="80" viewBox="0 0 100 100"
                            initial="hidden" animate="visible"
                            style={{ margin: '0 0 10px 0', display: 'block' }}
                          >
                            <motion.circle cx="50" cy="50" r="42" stroke="#28a745" strokeWidth="6" fill="rgba(40, 167, 69, 0.1)" variants={draw} custom={0} />
                            <motion.path d="M 33 52 L 45 64 L 68 38" stroke="#28a745" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" variants={draw} custom={0.5} />
                          </motion.svg>
                          
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                            <h4>Claim Approved!</h4>
                            <p>Show this QR code at the Security Desk to collect your item.</p>
                            <div className="qr-wrapper">
                              <QRCodeSVG
                                value={`https://apsit-safe.edu.in/pickup/${myClaim?.pickupToken || item.id}`}
                                size={160}
                                fgColor="#120058"
                                bgColor="#ffffff"
                              />
                            </div>
                            <p style={{ fontSize: '12px', color: '#155724', marginTop: '8px' }}>
                              {item.itemName} · {item.location}
                            </p>
                            <div className="qr-actions">
                              <button className="btn-gradient-card" onClick={() => window.print()}>🖨️ Print</button>
                              <button className="btn-gradient-card" onClick={handleDownloadQR}>⬇️ Image</button>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}

                      {claimStatus === 'rejected' && (
                        <motion.div 
                            key="rejected"
                            className="claim-rejected-state"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                          <h4>❌ Claim Not Approved</h4>
                          <p>Your proof didn't match. You may try again with better details.</p>
                          <button className="claim-btn" onClick={() => {
                            setClaimStatus('none');
                            setProof('');
                            setShowClaimModal(true);
                          }}>
                            🔄 Try Again
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </>
              )}

              {/* Items still LOST → show "Mark as Found" or "I Found This Item!" */}
              {isStatusLost && (
                <>
                  {canResolve ? (
                    <button className="claim-btn anim-singlePulse" onClick={handleMarkFound} style={{ background: 'linear-gradient(135deg, #28a745, #218838)' }}>
                      ✅ Mark as Found
                    </button>
                  ) : (
                    <button className="claim-btn anim-singlePulse" onClick={() => navigate('/found', { 
                      state: { 
                        linkedLostItemId: item.id,
                        itemName: item.itemName,
                        category: item.category,
                        description: item.description
                      } 
                    })} style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>
                      🔍 I Found This Item!
                    </button>
                  )}
                </>
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