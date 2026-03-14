import React, { useState } from 'react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

const ProfilePage = ({ isLoggedIn, setIsLoggedIn }) => {
  // Initial user state based on your profile
  const [userProfile, setUserProfile] = useState({
    name: "Ayyan Muqadam",
    email: "student@apsit.edu.in",
    branch: "Information Technology",
    year: "Second Year",
    rollNo: "IT-202X-XXX",
    phone: "+91 8591752540"
  });

  return (
    <div className="report-root">
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      <main className="profile-container-main">
        <div className="profile-card-aesthetic">
          <div className="profile-banner"></div>
          
          <div className="profile-content">
            <div className="profile-avatar-large">
              {userProfile.name.charAt(0)}
            </div>
            
            <div className="profile-header-text">
              <h2>{userProfile.name}</h2>
              <p className="branch-tag">{userProfile.branch} Engineer</p>
            </div>

            <div className="profile-details-grid">
              <div className="detail-item-box">
                <label>Email Address</label>
                <span>{userProfile.email}</span>
              </div>
              <div className="detail-item-box">
                <label>Phone Number</label>
                <span>{userProfile.phone}</span>
              </div>
              <div className="detail-item-box">
                <label>Year of Study</label>
                <span>{userProfile.year}</span>
              </div>
              <div className="detail-item-box">
                <label>Roll Number</label>
                <span>{userProfile.rollNo}</span>
              </div>
            </div>

            <button className="edit-profile-btn">Edit Profile Settings</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;