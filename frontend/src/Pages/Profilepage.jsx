import React, { useState } from 'react';

const ProfilePage = ({ isLoggedIn, setIsLoggedIn }) => {
  const [userProfile] = useState({
    name: "Ayyan Muqadam",
    email: "student@apsit.edu.in",
    branch: "Information Technology",
    year: "Second Year",
    rollNo: "IT-202X-XXX",
    phone: "+91 8591752540"
  });

  return (
    <div className="report-root">
      <main className="profile-container-main">
        <div className="profile-card-aesthetic anim-cardReveal">
          <div className="profile-banner" />
          
          <div className="profile-content">
            <div className="profile-avatar-large anim-avatarSpring">
              {userProfile.name.charAt(0)}
            </div>
            
            <div className="profile-header-text">
              <h2>{userProfile.name}</h2>
              <p className="branch-tag">🎓 {userProfile.branch} · {userProfile.year}</p>
            </div>

            <div className="profile-details-grid">
              <div className="detail-item-box anim-cardReveal" style={{ animationDelay: '0.1s' }}>
                <label>📧 Email Address</label>
                <span>{userProfile.email}</span>
              </div>
              <div className="detail-item-box anim-cardReveal" style={{ animationDelay: '0.17s' }}>
                <label>📱 Phone Number</label>
                <span>{userProfile.phone}</span>
              </div>
              <div className="detail-item-box anim-cardReveal" style={{ animationDelay: '0.24s' }}>
                <label>📅 Year of Study</label>
                <span>{userProfile.year}</span>
              </div>
              <div className="detail-item-box anim-cardReveal" style={{ animationDelay: '0.31s' }}>
                <label>🆔 Roll Number</label>
                <span>{userProfile.rollNo}</span>
              </div>
            </div>

            <button className="edit-profile-btn">✏️ Edit Profile Settings</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;