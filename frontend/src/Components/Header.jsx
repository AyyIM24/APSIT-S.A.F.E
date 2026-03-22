import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from '../contexts/ThemeContext';
import logo from '../Logo.png';

function Header({ isLoggedIn, setIsLoggedIn }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setShowDropdown(false);
        navigate("/");
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
                            
                            <li className="profile-container">
    <div className="profile-trigger" onClick={() => setShowDropdown(!showDropdown)}>
        <div className="avatar">A</div> 
    </div>

    {showDropdown && (
        <div className="dropdown-menu">
            <div className="dropdown-header">
                <strong>Ayyan Muqadam</strong>
                <p>student@apsit.edu.in</p>
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