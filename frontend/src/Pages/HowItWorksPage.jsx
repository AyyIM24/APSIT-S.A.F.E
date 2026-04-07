import React from 'react';
import { Link } from 'react-router-dom';

const steps = [
    {
        icon: '📝',
        title: 'Report',
        desc: 'Lost something? Found something? Submit a detailed report with photos, location, and description to alert the campus community.',
        color: '#667eea'
    },
    {
        icon: '🔍',
        title: 'Discover',
        desc: 'Browse the Discovery Hub to search through all reported lost and found items. Filter by category, location, and date.',
        color: '#764ba2'
    },
    {
        icon: '📋',
        title: 'Claim',
        desc: 'Found your item? Submit a claim request with proof of ownership. Our admin team will verify and approve genuine claims.',
        color: '#4facfe'
    },
    {
        icon: '✅',
        title: 'Collect',
        desc: 'Once approved, receive a QR verification code. Show it to the admin office to securely collect your belongings.',
        color: '#43e97b'
    }
];

const features = [
    { icon: '🔐', title: 'Secure Verification', desc: 'OTP email verification and QR code-based item handover ensure maximum security.' },
    { icon: '🔔', title: 'Real-time Notifications', desc: 'Get instant alerts when your item is found or when someone claims an item you reported.' },
    { icon: '📊', title: 'Admin Dashboard', desc: 'Dedicated admin panel to manage reports, verify claims, and track campus-wide statistics.' },
    { icon: '🌐', title: 'APSIT Exclusive', desc: 'Built exclusively for A.P. Shah Institute of Technology students and staff.' },
    { icon: '📱', title: 'Mobile Friendly', desc: 'Fully responsive design works seamlessly on phones, tablets, and desktops.' },
    { icon: '⚡', title: 'Fast & Easy', desc: 'Report or claim items in under 2 minutes with our streamlined wizard interface.' },
];

const HowItWorksPage = () => {
    return (
        <div className="hiw-page">
            {/* Hero */}
            <div className="hiw-hero anim-fadeScale">
                <h1>How It Works</h1>
                <p>APSIT S.A.F.E makes campus lost-and-found simple, secure, and fast.</p>
            </div>

            {/* Steps */}
            <div className="hiw-steps-section">
                <h2 className="hiw-section-title anim-fadeScale">4 Simple Steps</h2>
                <div className="hiw-steps-grid">
                    {steps.map((step, i) => (
                        <div className="hiw-step-card anim-fadeScale" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
                            <div className="hiw-step-number" style={{ background: step.color }}>{i + 1}</div>
                            <div className="hiw-step-icon">{step.icon}</div>
                            <h3>{step.title}</h3>
                            <p>{step.desc}</p>
                            {i < 3 && <div className="hiw-step-connector">→</div>}
                        </div>
                    ))}
                </div>
            </div>

            {/* Features */}
            <div className="hiw-features-section">
                <h2 className="hiw-section-title anim-fadeScale">Platform Features</h2>
                <div className="hiw-features-grid">
                    {features.map((feat, i) => (
                        <div className="hiw-feature-card anim-fadeScale" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="hiw-feature-icon">{feat.icon}</div>
                            <h4>{feat.title}</h4>
                            <p>{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="hiw-cta anim-fadeScale">
                <h2>Ready to get started?</h2>
                <p>Join the APSIT S.A.F.E community and never lose track of your belongings again.</p>
                <div className="hiw-cta-btns">
                    <Link to="/register"><button className="portal-btn">Register Now →</button></Link>
                    <Link to="/discovery"><button className="portal-btn portal-btn-outline">Browse Items</button></Link>
                </div>
            </div>
        </div>
    );
};

export default HowItWorksPage;
