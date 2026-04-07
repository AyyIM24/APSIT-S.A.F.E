import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="section-p1">
            <div className="col">
                <h4 style={{ fontSize: '20px' }}><u>Contact</u></h4>
                <p><strong>College:</strong> A.P. Shah Institute of Technology, Thane</p>
                <p><strong>Phone:</strong> +91 8591752540 / +91 7738993187</p>
                <p><strong>Hours:</strong> 24hrs, Mon-Sun</p>
                <div className="follow">
                    <h4 style={{ fontSize: '20px' }}><u>Follow Us</u></h4>
                    <div className="icon">
                        <i className="fab fa-facebook-f"></i>
                        <i className="fab fa-instagram"></i>
                    </div>
                </div>
            </div>
            <div className="col">
                <h4 style={{ fontSize: '20px' }}><u>About</u></h4>
                <Link to="/about">About Us</Link>
                <Link to="/howitworks">How It Works</Link>
            </div>
            <div className="col">
                <h4 style={{ fontSize: '20px' }}><u>My Account</u></h4>
                <Link to="/login">Sign In</Link>
                <Link to="/register">Register</Link>
                <Link to="/forgotpassword">Forgot Password</Link>
            </div>
            <div className="copyright">
                <p>Designed By :</p>
                <p><strong>Sakshi Palankar</strong> — Lead Developer</p>
                <p><strong>Ayyan Muqadam</strong> — Project Manager</p>
                <p><strong>Bishnupriya Mohapatra</strong> — Frontend Designer</p>
                <p><strong>Drishti More</strong> — Project Designer</p>
            </div>
            <div className='last'>
                <p>Copyright © 2026 APSIT S.A.F.E. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;