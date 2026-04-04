import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ProfilePage = ({ isLoggedIn, setIsLoggedIn }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/me');
        setUserProfile(response.data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        // Show error state instead of hardcoded fallback
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setEditing(true);
    setSaveMessage('');
    setEditForm({
      name: userProfile.name || '',
      phone: userProfile.phone || '',
      branch: userProfile.branch || '',
      year: userProfile.year || '',
      rollNo: userProfile.rollNo || ''
    });
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setSaveMessage('');
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
      const response = await api.put(`/users/${userProfile.id}/profile`, editForm);
      setUserProfile(response.data);
      setEditing(false);
      setSaveMessage('✅ Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
      setSaveMessage('❌ Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', fontSize: '2rem' }}>Loading profile...</div>;
  }

  if (!userProfile) {
    return (
      <div className="report-root">
        <main className="profile-container-main">
          <div className="profile-card-aesthetic anim-cardReveal" style={{ textAlign: 'center', padding: '60px 30px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>😕</div>
            <h2 style={{ color: 'white', marginBottom: '10px' }}>Unable to Load Profile</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Please log in again to view your profile.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="report-root">
      <main className="profile-container-main">
        <div className="profile-card-aesthetic anim-cardReveal">
          <div className="profile-banner" />
          
          <div className="profile-content">
            <div className="profile-avatar-large anim-avatarSpring">
              {userProfile.name ? userProfile.name.charAt(0) : '?'}
            </div>
            
            <div className="profile-header-text">
              <h2>{userProfile.name || 'Unknown'}</h2>
              <p className="branch-tag">🎓 {userProfile.branch || 'Branch not set'} · {userProfile.year || 'Year not set'}</p>
            </div>

            {saveMessage && (
              <div style={{ 
                padding: '10px 20px', 
                borderRadius: '10px', 
                background: saveMessage.includes('✅') ? 'rgba(46,213,115,0.15)' : 'rgba(255,71,87,0.15)',
                border: `1px solid ${saveMessage.includes('✅') ? 'rgba(46,213,115,0.3)' : 'rgba(255,71,87,0.3)'}`,
                color: saveMessage.includes('✅') ? '#2ed573' : '#ff4757',
                marginBottom: '15px',
                fontSize: '14px',
                fontWeight: 600
              }}>
                {saveMessage}
              </div>
            )}

            {!editing ? (
              <>
                <div className="profile-details-grid">
                  <div className="detail-item-box anim-cardReveal" style={{ animationDelay: '0.1s' }}>
                    <label>📧 Email Address</label>
                    <span>{userProfile.email || 'Not set'}</span>
                  </div>
                  <div className="detail-item-box anim-cardReveal" style={{ animationDelay: '0.17s' }}>
                    <label>📱 Phone Number</label>
                    <span>{userProfile.phone || 'Not set'}</span>
                  </div>
                  <div className="detail-item-box anim-cardReveal" style={{ animationDelay: '0.24s' }}>
                    <label>📅 Year of Study</label>
                    <span>{userProfile.year || 'Not set'}</span>
                  </div>
                  <div className="detail-item-box anim-cardReveal" style={{ animationDelay: '0.31s' }}>
                    <label>🆔 Roll Number</label>
                    <span>{userProfile.rollNo || 'Not set'}</span>
                  </div>
                </div>

                <button className="edit-profile-btn" onClick={handleEditClick}>✏️ Edit Profile Settings</button>
              </>
            ) : (
              <div className="profile-details-grid" style={{ marginBottom: '20px' }}>
                <div className="detail-item-box">
                  <label>👤 Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div className="detail-item-box">
                  <label>📱 Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    placeholder="+91 XXXXXXXXXX"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>
                <div className="detail-item-box">
                  <label>🎓 Branch</label>
                  <select
                    name="branch"
                    value={editForm.branch}
                    onChange={handleEditChange}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  >
                    <option value="" style={{ background: '#1a1a2e' }}>Select Branch</option>
                    <option value="Computer Engineering" style={{ background: '#1a1a2e' }}>Computer Engineering</option>
                    <option value="Information Technology" style={{ background: '#1a1a2e' }}>Information Technology</option>
                    <option value="AI & Data Science" style={{ background: '#1a1a2e' }}>AI & Data Science</option>
                    <option value="AI & Machine Learning" style={{ background: '#1a1a2e' }}>AI & Machine Learning</option>
                    <option value="Electronics & Telecommunication" style={{ background: '#1a1a2e' }}>Electronics & Telecom</option>
                    <option value="Mechanical Engineering" style={{ background: '#1a1a2e' }}>Mechanical Engineering</option>
                    <option value="Civil Engineering" style={{ background: '#1a1a2e' }}>Civil Engineering</option>
                  </select>
                </div>
                <div className="detail-item-box">
                  <label>📅 Year of Study</label>
                  <select
                    name="year"
                    value={editForm.year}
                    onChange={handleEditChange}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  >
                    <option value="" style={{ background: '#1a1a2e' }}>Select Year</option>
                    <option value="First Year" style={{ background: '#1a1a2e' }}>First Year</option>
                    <option value="Second Year" style={{ background: '#1a1a2e' }}>Second Year</option>
                    <option value="Third Year" style={{ background: '#1a1a2e' }}>Third Year</option>
                    <option value="Fourth Year" style={{ background: '#1a1a2e' }}>Fourth Year</option>
                  </select>
                </div>
                <div className="detail-item-box">
                  <label>🆔 Roll Number</label>
                  <input
                    type="text"
                    name="rollNo"
                    value={editForm.rollNo}
                    onChange={handleEditChange}
                    placeholder="e.g. IT-2024-042"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button 
                    className="edit-profile-btn" 
                    onClick={handleSaveProfile}
                    disabled={saving}
                    style={{ flex: 1, background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                  >
                    {saving ? '⏳ Saving...' : '💾 Save Changes'}
                  </button>
                  <button 
                    className="edit-profile-btn" 
                    onClick={handleCancelEdit}
                    disabled={saving}
                    style={{ flex: 1, background: 'rgba(255,255,255,0.08)' }}
                  >
                    ✕ Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;