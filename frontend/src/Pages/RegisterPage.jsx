import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const RegisterPage = ({ isLoggedIn, setIsLoggedIn }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const navigate = useNavigate();

    // Password strength logic
    const passwordStrength = useMemo(() => {
        if (!password) return { level: 0, label: '', color: '' };
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

        if (score <= 1) return { level: 25, label: 'Weak', color: '#ff4757' };
        if (score === 2) return { level: 50, label: 'Fair', color: '#ffa502' };
        if (score === 3) return { level: 75, label: 'Good', color: '#2ed573' };
        return { level: 100, label: 'Strong', color: '#17c0eb' };
    }, [password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) { 
            setError('Passwords do not match.'); 
            return; 
        }
        if (passwordStrength.level < 75) {
            setError('Password must be 8+ chars with uppercase, number, and special character.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/register', { name, email, password });
            setLoading(false);
            setRegisterSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 1200);
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Registration failed.');
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="auth-page">
            <AnimatePresence>
                {registerSuccess && (
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
                            🎉
                        </motion.div>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            Account Created!
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`auth-card anim-formRise ${registerSuccess ? 'hidden' : ''}`}>
                <div className="auth-card-header">
                    <div className="auth-icon">📝</div>
                    <h1>Create Account</h1>
                    <p>Join APSIT S.A.F.E — help reunite lost items</p>
                </div>

                {error && (
                    <div className="auth-error">
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-field">
                        <label>Full Name</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">👤</span>
                            <input type="text" placeholder="e.g. Ayyan Muqadam" required value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
                        </div>
                    </div>

                    <div className="auth-field">
                        <label>Email Address</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">📧</span>
                            <input type="email" placeholder="student@apsit.edu.in" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
                        </div>
                    </div>

                    <div className="auth-field">
                        <label>Password</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">🔒</span>
                            <input type="password" placeholder="Min 8 chars, mixed case + special" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
                        </div>
                        {/* Password Strength Bar */}
                        {password && (
                            <div className="password-strength">
                                <div className="strength-bar-bg">
                                    <div 
                                        className="strength-bar-fill" 
                                        style={{ width: `${passwordStrength.level}%`, background: passwordStrength.color }}
                                    />
                                </div>
                                <span className="strength-label" style={{ color: passwordStrength.color }}>
                                    {passwordStrength.label}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="auth-field">
                        <label>Confirm Password</label>
                        <div className="auth-input-wrapper">
                            <span className="auth-input-icon">🔒</span>
                            <input type="password" placeholder="Re-enter password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} />
                        </div>
                        {confirmPassword && password !== confirmPassword && (
                            <span className="field-hint-error">Passwords don't match</span>
                        )}
                        {confirmPassword && password === confirmPassword && (
                            <span className="field-hint-success">✓ Passwords match</span>
                        )}
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? (
                            <><span className="auth-spinner"></span> Creating account...</>
                        ) : (
                            'Create Account →'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Already have an account?</p>
                    <Link to="/login" className="auth-link">Sign In →</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;