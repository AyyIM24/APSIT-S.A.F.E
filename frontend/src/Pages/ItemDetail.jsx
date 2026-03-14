import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const ItemDetail = ({ isLoggedIn, setIsLoggedIn }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- STATE MANAGEMENT ---
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [hasUserClaimed, setHasUserClaimed] = useState(false); // Tracks if you personally claimed it
  const [proof, setProof] = useState("");

  // Temporary data (Matches your Discovery Hub)
  const items = [
    { id: 1, name: "Blue HP Laptop", category: "Electronics", location: "Library 2nd Floor (Near Window)", date: "2026-02-14", description: "Found a blue HP laptop with a 'Thane' sticker on the back.", status: "SECURED", image: process.env.PUBLIC_URL + "/images/Img 1.jpg"},
    { id: 2, name: "iPhone 13", category: "Electronics", location: "Canteen", date: "2026-02-13", description: "Black case, found on a corner table.", status: "SECURED", image: process.env.PUBLIC_URL + "/images/Img 2.jpg"},
    { id: 3, name: "APSIT ID Card", category: "ID Cards", location: "Lab 402", date: "2026-02-12", description: "Name on card is Ayyan.", status: "SECURED", image: process.env.PUBLIC_URL + "/images/Img 3.jpeg"},
  ];

  const item = items.find(i => i.id === parseInt(id));

  // --- CLAIM HANDLER ---
  const handleClaimSubmit = (e) => {
    e.preventDefault();
    // Simulate sending proof to Admin while keeping the item visible for others
    console.log(`Proof submitted for Item ${id}:`, proof);
    setHasUserClaimed(true); 
    setShowClaimModal(false);
    alert("Claim request submitted! The Admin will verify your proof against other requests.");
  };

  if (!item) {
    return (
      <div className="report-root">
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <h2 style={{textAlign: 'center', marginTop: '50px', color: 'white'}}>Item Not Found</h2>
        <Footer />
      </div>
    );
  }

  return (
    <div className="report-root">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <main className="detail-container">
        <button className="back-btn" onClick={() => navigate(-1)}>← Back to Hub</button>
        
        <div className="detail-card">
          <div className="detail-image">
            <img src={item.image} alt={item.name} />
            {/* Status stays as is so other owners can still find it */}
            <span className="status-badge-large">{item.status}</span>
          </div>

          <div className="detail-info">
            <h1>{item.name}</h1>
            <div className="meta-tag">{item.category}</div>
            
            <div className="info-grid">
              <div className="info-item">
                <label>📍 Location Found</label>
                <p>{item.location}</p>
              </div>
              <div className="info-item">
                <label>📅 Date Reported</label>
                <p>{item.date}</p>
              </div>
            </div>

            <div className="description-box">
              <label>Description</label>
              <p>{item.description}</p>
            </div>

            {/* If you haven't claimed it, button is active. If you have, it shows status */}
            {!hasUserClaimed ? (
              <button className="claim-btn" onClick={() => setShowClaimModal(true)}>
                Claim This Item
              </button>
            ) : (
              <div className="claim-status-note">
                <p>✅ Your claim is under review by Admin</p>
              </div>
            )}
          </div>
        </div>

        {/* --- CLAIM MODAL --- */}
        {showClaimModal && (
          <div className="modal-overlay">
            <div className="modal-content-aesthetic">
              <h2>Submit <span>Proof</span></h2>
              <p>To prevent fraud, provide details only the owner knows (e.g. wallpaper, specific damage).</p>
              
              <form onSubmit={handleClaimSubmit}>
                <div className="input-group">
                  <textarea 
                    required 
                    placeholder="Enter your proof details..."
                    value={proof}
                    onChange={(e) => setProof(e.target.value)}
                  />
                </div>
                <div className="modal-btns">
                  <button type="button" className="cancel-btn" onClick={() => setShowClaimModal(false)}>Cancel</button>
                  <button type="submit" className="submit-btn-gradient">Submit to Admin</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ItemDetail;