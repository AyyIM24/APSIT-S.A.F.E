import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api, { authService } from '../services/api';
import GoogleSignInButton from '../Components/GoogleSignInButton';

const LoginPage = ({ onLogin, setIsLoggedIn, isLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            authService.setAuth(response.data.token, { email, name: response.data.name, role: 'ROLE_USER' });
            
            // Still call parent to update App state if needed
            if (onLogin) await onLogin({ email, password });
            setIsLoggedIn(true);

            setLoading(false);
            setLoginSuccess(true);
            setTimeout(() => {
                navigate('/discovery');
            }, 1200); // Delay navigation to allow animation to finish
        } catch (err) {
            setLoading(false);

            if (err.response) {
                // Handle unverified email — redirect to OTP page
                if (err.response.status === 403 && err.response.data?.requiresOtp) {
                    navigate('/verify-otp', {
                        state: {
                            userId: err.response.data.userId,
                            email: email
                        }
                    });
                    return;
                }

                // Regular auth errors
                setError(err.response.data?.error || 'Invalid email or password.');
            } else {
                setError('Login failed. Please try again.');
            }
        }
    };


    return (
        <div className="auth-page">
            <AnimatePresence>
                {loginSuccess && (
                    <motion.div 
                        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
                        animate={{ clipPath: 'circle(150% at 50% 50%)' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            zIndex: 9999,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            flexDirection: 'column',
                            gap: '20px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0, opacity: 0, rotate: -45 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                            style={{ fontSize: '4rem' }}
                        >
                            🛡️
                        </motion.div>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            Access Granted
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`auth-card anim-formRise ${loginSuccess ? 'hidden' : ''}`}>
                <div className="auth-card-header">
                    <div className="auth-icon">🔐</div>
                    <h1>Welcome Back</h1>
                    <p>Sign in to your APSIT S.A.F.E account</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field">
                        <label htmlFor="email">Email Address</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">📧</span>
                            <input 
                                type="email" id="email" 
                                placeholder="Enter your email"
                                required value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                                disabled={loading} 
                            />
                        </div>
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">Password</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">🔒</span>
                            <input 
                                type="password" id="password" 
                                placeholder="Enter your password"
                                required value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                disabled={loading} 
                            />
                        </div>
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? (
                            <><span className="auth-spinner"></span> Signing in...</>
                        ) : (
                            'Sign In →'
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: '20px 0',
                    gap: '12px'
                }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' }} />
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: 600 }}>or</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.15)' }} />
                </div>

                {/* Google Sign-In */}
                <GoogleSignInButton setIsLoggedIn={setIsLoggedIn} onLogin={onLogin} />

                <div className="auth-footer">
                    <p>Don't have an account?</p>
                    <Link to="/register" className="auth-link">Create Account →</Link>
                    <Link to="/forgotpassword" className="auth-link-muted">Forgot Password?</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;