import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1=email, 2=otp, 3=newPassword, 4=success
    const [email, setEmail] = useState('');
    const [userId, setUserId] = useState(null);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    // Step 1: Send OTP to email
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email) { setError('Please enter your email.'); return; }
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setUserId(res.data.userId);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // OTP input handlers
    const handleOtpChange = (index, value) => {
        if (value && !/^\d$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');
        if (value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length > 0) {
            const newOtp = [...otp];
            for (let i = 0; i < 6; i++) newOtp[i] = pasted[i] || '';
            setOtp(newOtp);
            inputRefs.current[Math.min(pasted.length, 5)]?.focus();
        }
    };

    // Step 2: Verify OTP & proceed to password
    const handleVerifyOtp = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) { setError('Please enter all 6 digits.'); return; }
        setStep(3);
        setError('');
    };

    // Step 3: Reset password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/reset-password', {
                email,
                otpCode: otp.join(''),
                newPassword,
            });
            setStep(4);
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const [resendCooldown, setResendCooldown] = useState(0);
    const handleResend = async () => {
        if (resendCooldown > 0) return;
        try {
            await api.post('/auth/forgot-password', { email });
            setResendCooldown(30);
            setError('');
            const timer = setInterval(() => {
                setResendCooldown(prev => {
                    if (prev <= 1) { clearInterval(timer); return 0; }
                    return prev - 1;
                });
            }, 1000);
        } catch (err) {
            setError('Failed to resend OTP.');
        }
    };

    const stepIcons = ['📧', '🔢', '🔐', '✅'];
    const stepLabels = ['Email', 'Verify', 'Password', 'Done'];

    return (
        <div className="auth-page">
            {/* Success Animation */}
            <AnimatePresence>
                {step === 4 && (
                    <motion.div
                        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
                        animate={{ clipPath: 'circle(150% at 50% 50%)' }}
                        transition={{ duration: 0.8, ease: 'easeInOut' }}
                        style={{
                            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontSize: '2rem', fontWeight: 'bold',
                            flexDirection: 'column', gap: '20px'
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                            style={{ fontSize: '4rem' }}
                        >✅</motion.div>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >Password Reset Successful!</motion.div>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.9 }}
                            style={{ fontSize: '1rem', opacity: 0.8 }}
                        >Redirecting to login...</motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`auth-card anim-formRise ${step === 4 ? 'hidden' : ''}`}>
                {/* Step Progress */}
                <div style={{
                    display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '28px'
                }}>
                    {stepIcons.map((icon, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '50%',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.1rem',
                                background: step > i + 1 ? 'linear-gradient(135deg, #28a745, #20c997)'
                                    : step === i + 1 ? 'linear-gradient(135deg, #667eea, #764ba2)'
                                    : 'rgba(255,255,255,0.08)',
                                border: step === i + 1 ? '2px solid #667eea' : '2px solid transparent',
                                boxShadow: step === i + 1 ? '0 0 15px rgba(102,126,234,0.3)' : 'none',
                                transition: 'all 0.3s ease'
                            }}>
                                {step > i + 1 ? '✓' : icon}
                            </div>
                            {i < 3 && (
                                <div style={{
                                    width: '30px', height: '3px', borderRadius: '2px',
                                    background: step > i + 1 ? '#28a745' : 'rgba(255,255,255,0.1)',
                                    transition: 'all 0.3s ease'
                                }} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step 1: Email */}
                {step === 1 && (
                    <>
                        <div className="auth-card-header">
                            <div className="auth-icon">🔑</div>
                            <h1>Forgot Password</h1>
                            <p>Enter your registered email to receive a verification code</p>
                        </div>

                        {error && <div className="auth-error"><span>⚠️</span> {error}</div>}

                        <form onSubmit={handleSendOtp} className="auth-form">
                            <div className="auth-field">
                                <label>Email Address</label>
                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">📧</span>
                                    <input
                                        type="email" placeholder="student@apsit.edu.in"
                                        required value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="auth-submit-btn" disabled={loading}>
                                {loading ? (<><span className="auth-spinner"></span> Sending...</>) : 'Send Verification Code →'}
                            </button>
                        </form>

                        <div className="auth-footer">
                            <p>Remember your password?</p>
                            <Link to="/login" className="auth-link">Back to Login →</Link>
                        </div>
                    </>
                )}

                {/* Step 2: OTP */}
                {step === 2 && (
                    <>
                        <div className="auth-card-header">
                            <div className="auth-icon">📧</div>
                            <h1>Enter Verification Code</h1>
                            <p>We sent a 6-digit code to <strong style={{ color: '#667eea' }}>{email}</strong></p>
                        </div>

                        {error && <div className="auth-error"><span>⚠️</span> {error}</div>}

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '28px 0' }}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => inputRefs.current[index] = el}
                                    type="text" inputMode="numeric" maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    onPaste={index === 0 ? handleOtpPaste : undefined}
                                    autoFocus={index === 0}
                                    style={{
                                        width: '48px', height: '56px', textAlign: 'center',
                                        fontSize: '1.5rem', fontWeight: '700', borderRadius: '12px',
                                        border: digit ? '2px solid #667eea' : '2px solid rgba(255,255,255,0.15)',
                                        background: 'rgba(255,255,255,0.05)', color: 'white',
                                        outline: 'none', transition: 'all 0.2s ease', caretColor: '#667eea',
                                    }}
                                />
                            ))}
                        </div>

                        <button className="auth-submit-btn" onClick={handleVerifyOtp}
                            disabled={otp.join('').length !== 6}
                            style={{ width: '100%', marginBottom: '16px' }}
                        >
                            Verify Code →
                        </button>

                        <div style={{ textAlign: 'center', fontSize: '14px' }}>
                            {resendCooldown > 0 ? (
                                <span style={{ color: 'rgba(255,255,255,0.5)' }}>
                                    Resend in <strong style={{ color: '#667eea' }}>{resendCooldown}s</strong>
                                </span>
                            ) : (
                                <button onClick={handleResend} style={{
                                    background: 'none', border: 'none', color: '#667eea',
                                    cursor: 'pointer', fontWeight: 700, textDecoration: 'underline'
                                }}>Resend verification code</button>
                            )}
                        </div>

                        <div style={{ textAlign: 'center', marginTop: '16px' }}>
                            <button onClick={() => { setStep(1); setError(''); }}
                                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontWeight: 600 }}
                            >← Change email</button>
                        </div>
                    </>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                    <>
                        <div className="auth-card-header">
                            <div className="auth-icon">🔐</div>
                            <h1>Set New Password</h1>
                            <p>Create a strong password for your account</p>
                        </div>

                        {error && <div className="auth-error"><span>⚠️</span> {error}</div>}

                        <form onSubmit={handleResetPassword} className="auth-form">
                            <div className="auth-field">
                                <label>New Password</label>
                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">🔒</span>
                                    <input
                                        type="password" placeholder="Enter new password (min 6 chars)"
                                        required value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <div className="auth-field">
                                <label>Confirm Password</label>
                                <div className="auth-input-wrapper">
                                    <span className="auth-input-icon">🔒</span>
                                    <input
                                        type="password" placeholder="Confirm new password"
                                        required value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="auth-submit-btn" disabled={loading}>
                                {loading ? (<><span className="auth-spinner"></span> Resetting...</>) : 'Reset Password →'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
