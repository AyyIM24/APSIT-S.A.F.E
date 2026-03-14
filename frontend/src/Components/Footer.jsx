import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="section-p1">
            <div className="col">
                <img src="/images/Logo.webp" className="logo" alt="" />
                <h4 style={{fontSize: '20px'}}><u>Contact</u></h4>
                <p><strong>Address:</strong> 83-b/54/Kavery Adhyapak Vinoba bhave Nagar Kurla(W) Mumbai-70</p>
                <p><strong>Phone:</strong> +91 8591752540 / +91 7738993187</p>
                <p><strong>Hours:</strong> 24hrs, Mon-Sun</p>
                <div className="follow">
                    <h4 style={{fontSize: '20px'}}><u>Follow Us</u></h4>
                    <div className="icon">
                        <i className="fab fa-facebook-f"></i>
                        <i className="fab fa-instagram"></i>
                    </div>
                </div>
            </div>
            <div className="col">
                <h4 style={{fontSize: '20px'}}><u>About</u></h4>
                <Link to="#">About Us</Link>
                <Link to="#">Privacy Policy</Link>
                <Link to="#">Terms & Conditions</Link>
            </div>
            <div className="col">
                <h4 style={{fontSize: '20px'}}><u>My Account</u></h4>
                <Link to="/login">Sign In</Link>
                <Link to="/customer-service">Help</Link>
            </div>
            <div className="copyright">
                <p>Desinged By :</p>
                <p><strong>Bishnupriya Mohapatra</strong></p>
                <p><strong>Drishti More</strong></p>
                <p><strong>Sakshi Palankar</strong></p>
                <p><strong>Ayyan Muqadam</strong></p>
            </div>
            <div className='last'>
                <p>Copyright © 2024 APSIT S.A.F.E. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;