import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from '../contexts/ThemeContext';
import { authService } from '../services/api';
import api from '../services/api';
import logo from '../Logo.png';

function Header({ isLoggedIn, setIsLoggedIn }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const notifRef = useRef(null);
    const user = authService.getUser();

    // Fetch unread count on mount and poll every 30s
    useEffect(() => {
        if (!isLoggedIn) return;
        
        const fetchUnreadCount = async () => {
            try {
                const res = await api.get('/notifications/unread-count');
                setUnreadCount(res.data.count || 0);
            } catch (err) {
                // Silently fail — don't break the header
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [isLoggedIn]);

    // Fetch full notifications when bell is clicked
    const handleBellClick = async () => {
        setShowNotifications(!showNotifications);
        setShowDropdown(false);
        
        if (!showNotifications) {
            try {
                const res = await api.get('/notifications');
                setNotifications(res.data || []);
            } catch (err) {
                console.error("Failed to fetch notifications", err);
            }
        }
    };

    // Mark single notification as read
    const handleNotificationClick = async (notif) => {
        if (!notif.isRead) {
            try {
                await api.put(`/notifications/${notif.id}/read`);
                setNotifications(prev =>
                    prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch (err) {
                console.error("Failed to mark as read", err);
            }
        }
        // Navigate to item detail if itemId exists
        if (notif.itemId) {
            setShowNotifications(false);
            navigate(`/item/${notif.itemId}`);
        }
    };

    // Mark all as read
    const handleMarkAllRead = async () => {
        try {
            await api.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        authService.clearAuth();
        setIsLoggedIn(false);
        setShowDropdown(false);
        setShowNotifications(false);
        navigate("/");
    };

    // Notification type to icon mapping
    const notifIcon = (type) => {
        switch (type) {
            case 'ITEM_FOUND': return '📦';
            case 'CLAIM_SUBMITTED': return '📋';
            case 'CLAIM_APPROVED': return '✅';
            case 'CLAIM_REJECTED': return '❌';
            case 'PICKUP_COMPLETE': return '🎉';
            default: return '🔔';
        }
    };

    // Format time ago
    const timeAgo = (dateStr) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHrs = Math.floor(diffMins / 60);
        if (diffHrs < 24) return `${diffHrs}h ago`;
        const diffDays = Math.floor(diffHrs / 24);
        return `${diffDays}d ago`;
    };

    return (
        <header className="header-main">
            <div className="title">
                <img src={logo} alt="Logo"/>
                <h1>APSIT S.A.F.E</h1>
                
                <ul>
                    <li className="theme-toggle-item">
                        <button onClick={toggleTheme} className="theme-toggle-btn" aria-label="Toggle Theme">
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>
                    </li>
                    <li><Link to={isLoggedIn ? "/discovery" : "/"}>Home</Link></li>

                    {!isLoggedIn ? (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/howitworks">How It Works</Link></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/report">Lost Items</Link></li>
                            <li><Link to="/found">Found Items</Link></li>
                            <li><Link to="/howitworks">How It Works</Link></li>
                            
                            {/* Notification Bell */}
                            <li className="notification-container" ref={notifRef}>
                                <button 
                                    className="notification-bell-btn"
                                    onClick={handleBellClick}
                                    aria-label="Notifications"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        position: 'relative',
                                        fontSize: '1.3rem',
                                        padding: '6px',
                                        color: 'white',
                                        transition: 'transform 0.2s ease'
                                    }}
                                >
                                    🔔
                                    {unreadCount > 0 && (
                                        <span style={{
                                            position: 'absolute',
                                            top: '0',
                                            right: '-2px',
                                            background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)',
                                            color: 'white',
                                            borderRadius: '50%',
                                            width: '18px',
                                            height: '18px',
                                            fontSize: '10px',
                                            fontWeight: 800,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: '2px solid rgba(18, 0, 88, 0.8)',
                                            animation: 'pulse 2s infinite'
                                        }}>
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {showNotifications && (
                                    <div className="notification-panel" style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: '0',
                                        width: '360px',
                                        maxHeight: '450px',
                                        overflowY: 'auto',
                                        background: 'rgba(18, 0, 88, 0.95)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px',
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                                        zIndex: 1000,
                                        marginTop: '12px'
                                    }}>
                                        {/* Panel Header */}
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '16px 18px 12px',
                                            borderBottom: '1px solid rgba(255,255,255,0.08)'
                                        }}>
                                            <span style={{ color: 'white', fontWeight: 800, fontSize: '15px' }}>
                                                Notifications
                                            </span>
                                            {unreadCount > 0 && (
                                                <button 
                                                    onClick={handleMarkAllRead}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#667eea',
                                                        cursor: 'pointer',
                                                        fontSize: '12px',
                                                        fontWeight: 700
                                                    }}
                                                >
                                                    Mark all read
                                                </button>
                                            )}
                                        </div>

                                        {/* Notification Items */}
                                        {notifications.length === 0 ? (
                                            <div style={{
                                                padding: '40px 20px',
                                                textAlign: 'center',
                                                color: 'rgba(255,255,255,0.4)',
                                                fontSize: '14px'
                                            }}>
                                                <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🔕</div>
                                                No notifications yet
                                            </div>
                                        ) : (
                                            notifications.slice(0, 20).map(notif => (
                                                <div
                                                    key={notif.id}
                                                    onClick={() => handleNotificationClick(notif)}
                                                    style={{
                                                        padding: '14px 18px',
                                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                                        cursor: 'pointer',
                                                        transition: 'background 0.2s ease',
                                                        background: notif.isRead ? 'transparent' : 'rgba(102, 126, 234, 0.08)',
                                                        display: 'flex',
                                                        gap: '12px',
                                                        alignItems: 'flex-start'
                                                    }}
                                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                                    onMouseLeave={e => e.currentTarget.style.background = notif.isRead ? 'transparent' : 'rgba(102, 126, 234, 0.08)'}
                                                >
                                                    <span style={{ fontSize: '1.3rem', flexShrink: 0, marginTop: '2px' }}>
                                                        {notifIcon(notif.type)}
                                                    </span>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{
                                                            color: 'white',
                                                            fontSize: '13px',
                                                            fontWeight: notif.isRead ? 500 : 700,
                                                            marginBottom: '4px',
                                                            lineHeight: 1.3
                                                        }}>
                                                            {notif.title}
                                                        </div>
                                                        <div style={{
                                                            color: 'rgba(255,255,255,0.5)',
                                                            fontSize: '12px',
                                                            lineHeight: 1.4,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical'
                                                        }}>
                                                            {notif.message}
                                                        </div>
                                                        <div style={{
                                                            color: 'rgba(255,255,255,0.3)',
                                                            fontSize: '11px',
                                                            marginTop: '4px'
                                                        }}>
                                                            {timeAgo(notif.createdAt)}
                                                        </div>
                                                    </div>
                                                    {!notif.isRead && (
                                                        <span style={{
                                                            width: '8px',
                                                            height: '8px',
                                                            borderRadius: '50%',
                                                            background: '#667eea',
                                                            flexShrink: 0,
                                                            marginTop: '6px'
                                                        }} />
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </li>

                            <li className="profile-container">
    <div className="profile-trigger" onClick={() => { setShowDropdown(!showDropdown); setShowNotifications(false); }}>
        <div className="avatar">{user?.name ? user.name.charAt(0).toUpperCase() : 'A'}</div> 
    </div>

    {showDropdown && (
        <div className="dropdown-menu">
            <div className="dropdown-header">
                <strong>{user?.name || 'User'}</strong>
                <p>{user?.email || 'student@apsit.edu.in'}</p>
            </div>
            <hr />
            <ul className="dropdown-list">
                <li><Link to="/profile">My Profile</Link></li>
                <li><Link to="/myreports">My Reports</Link></li>
                <li onClick={handleLogout} className="logout-item">Logout</li>
            </ul>
        </div>
    )}
</li>
                        </>
                    )}
                </ul>
            </div>
        </header>
    );
}

export default Header;