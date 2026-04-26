import React from 'react';
import apsitLogo from '../Apsit.jpg';

const team = [
    {
        name: 'Sakshi Nagaraj Palankar',
        role: 'Lead Developer',
        phone: '+91 8591752540',
        image: '/Images/Sakshi.jpeg',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        imgStyle: { objectPosition: 'center 15%', transform: 'scale(1.8)' }
    },
    {
        name: 'Ayyan Iqbal Muqadam',
        role: 'Project Manager',
        phone: '+91 7738993187',
        image: '/Images/Ayyan.jpeg',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        imgStyle: { objectPosition: 'center 10%' }
    },
    {
        name: 'Bishnupriya Prasanna Mohapatra',
        role: 'Frontend Designer',
        phone: '+91 8080240894',
        image: '/Images/Bishnupriya.jpeg',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        imgStyle: { objectPosition: 'center 15%', transform: 'scale(1.8)' }
    },
    {
        name: 'Drishti Pramod More',
        role: 'Project Designer & Database Manager',
        phone: '+91 9320153664',
        image: '/Images/Dristi.jpeg',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        imgStyle: { objectPosition: 'center' }
    },
];

const AboutUsPage = () => {
    return (
        <div className="about-page">
            {/* College Section */}
            <div className="about-college anim-fadeScale">
                <div className="about-college-logo">
                    <img src={apsitLogo} alt="APSIT Logo" />
                </div>
                <div className="about-college-info">
                    <h1>A.P. Shah Institute of Technology</h1>
                    <p className="about-college-tagline">Department of Information Technology Engineering</p>
                    <p className="about-college-desc">
                        A.P. Shah Institute of Technology (APSIT) is a premier engineering college located in Thane, Maharashtra.
                        Established under the Vidya Prasarak Mandal, APSIT is committed to nurturing innovation and excellence in
                        technology education. Our students continually push boundaries to create impactful solutions for real-world problems.
                    </p>
                </div>
            </div>

            {/* Project Section */}
            <div className="about-project anim-fadeScale" style={{ animationDelay: '0.15s' }}>
                <div className="about-project-badge">🛡️</div>
                <h2>About APSIT S.A.F.E</h2>
                <p>
                    <strong>Student Asset & Found-item Exchange</strong> (S.A.F.E) is a comprehensive digital platform
                    designed to streamline the lost-and-found process across the APSIT campus. Built with modern web
                    technologies, this platform enables students to report lost items, browse found items, submit verified
                    claims, and securely collect their belongings — all through an intuitive and visually immersive interface.
                </p>
                <div className="about-project-tech">
                    <span className="tech-badge">React</span>
                    <span className="tech-badge">Spring Boot</span>
                    <span className="tech-badge">MySQL</span>
                    <span className="tech-badge">JWT Auth</span>
                    <span className="tech-badge">QR Codes</span>
                    <span className="tech-badge">Email OTP</span>
                </div>
            </div>

            {/* Team Section */}
            <div className="about-team-section">
                <h2 className="about-section-title anim-fadeScale" style={{ animationDelay: '0.2s' }}>Meet Our Team</h2>
                <div className="about-team-grid">
                    {team.map((member, i) => (
                        <div className="about-team-card anim-fadeScale" key={i} style={{ animationDelay: `${0.25 + i * 0.1}s` }}>
                            <div className="about-team-avatar" style={{ background: member.gradient, overflow: 'hidden' }}>
                                <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', ...member.imgStyle }} />
                            </div>
                            <h3>{member.name}</h3>
                            <div className="about-team-role">{member.role}</div>
                            <div className="about-team-phone">
                                <span>📞</span> {member.phone}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Quote */}
            <div className="about-quote anim-fadeScale" style={{ animationDelay: '0.5s' }}>
                <blockquote>
                    "Building technology that brings lost things back to their rightful owners."
                </blockquote>
                <p>— Team S.A.F.E, APSIT 2026</p>
            </div>
        </div>
    );
};

export default AboutUsPage;
