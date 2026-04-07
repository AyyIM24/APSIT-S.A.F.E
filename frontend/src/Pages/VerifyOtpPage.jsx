import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api, { authService } from '../services/api';

const VerifyOtpPage = ({ setIsLoggedIn }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userId, email } = location.state || {};

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);

    // Redirect if no userId in state
    useEffect(() => {
        if (!userId) {
            navigate('/register');
        }
    }, [userId, navigate]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setInterval(() => {
                setResendCooldown(prev => {
                    if (prev <= 1) {
                        setCanResend(true);
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [resendCooldown]);

    const handleChange = (index, value) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // On backspace, clear current and focus previous
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                const newOtp = [...otp];
                newOtp[index - 1] = '';
                setOtp(newOtp);
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pastedData.length > 0) {
            const newOtp = [...otp];
            for (let i = 0; i < 6; i++) {
                newOtp[i] = pastedData[i] || '';
            }
            setOtp(newOtp);
            // Focus last filled input or submit
            const lastIndex = Math.min(pastedData.length, 5);
            inputRefs.current[lastIndex]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Please enter all 6 digits.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await api.post('/auth/verify-otp', { userId, otpCode });
            const data = res.data;

            // Save auth and navigate
            authService.setAuth(data.token, {
                email: data.email,
                name: data.name,
                userId: data.userId,
                role: 'ROLE_USER',
            });

            if (setIsLoggedIn) setIsLoggedIn(true);
            setSuccess(true);

            setTimeout(() => {
                navigate('/discovery');
            }, 1200);
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.data) {
                setError(err.response.data.error || err.response.data.message || 'Verification failed.');
            } else {
                setError('Verification failed. Please try again.');
            }
        }
    };

    const [resendSuccess, setResendSuccess] = useState('');
    const [resendLoading, setResendLoading] = useState(false);

    const handleResend = async () => {
        if (!canResend || resendLoading) return;

        setResendLoading(true);
        setResendSuccess('');
        try {
            await api.post('/auth/resend-otp', { userId });
            setOtp(['', '', '', '', '', '']);
            setError('');
            setCanResend(false);
            setResendCooldown(30);
            setResendSuccess('✅ New verification code sent to your email!');
            inputRefs.current[0]?.focus();
            // Auto-dismiss after 4 seconds
            setTimeout(() => setResendSuccess(''), 4000);
        } catch (err) {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    if (!userId) return null;

    return (
        <div className="auth-page">
            {success && (
                <motion.div
                    initial={{ clipPath: 'circle(0% at 50% 50%)' }}
                    animate={{ clipPath: 'circle(150% at 50% 50%)' }}
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
                        ✅
                    </motion.div>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        Email Verified!
                    </motion.div>
                </motion.div>
            )}

            <div className={`auth-card anim-formRise ${success ? 'hidden' : ''}`}>
                <div className="auth-card-header">
                    <div className="auth-icon">📧</div>
                    <h1>Verify Your Email</h1>
                    <p>
                        We sent a 6-digit code to{' '}
                        <strong style={{ color: '#667eea' }}>{email || 'your email'}</strong>
                    </p>
                </div>

                {error && (
                    <div className="auth-error">
                        <span>⚠️</span> {error}
                    </div>
                )}

                {/* OTP Input Boxes */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    margin: '28px 0',
                }}>
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={el => inputRefs.current[index] = el}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            onPaste={index === 0 ? handlePaste : undefined}
                            disabled={loading}
                            autoFocus={index === 0}
                            style={{
                                width: '48px',
                                height: '56px',
                                textAlign: 'center',
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                borderRadius: '12px',
                                border: digit
                                    ? '2px solid #667eea'
                                    : '2px solid rgba(255,255,255,0.15)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                outline: 'none',
                                transition: 'all 0.2s ease',
                                caretColor: '#667eea',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#667eea';
                                e.target.style.boxShadow = '0 0 0 3px rgba(102,126,234,0.2)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = digit ? '#667eea' : 'rgba(255,255,255,0.15)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    ))}
                </div>

                {/* Verify Button */}
                <button
                    className="auth-submit-btn"
                    onClick={handleVerify}
                    disabled={loading || otp.join('').length !== 6}
                    style={{ width: '100%', marginBottom: '16px' }}
                >
                    {loading ? (
                        <><span className="auth-spinner"></span> Verifying...</>
                    ) : (
                        'Verify Email →'
                    )}
                </button>

                {/* Resend Success Toast */}
                {resendSuccess && (
                    <div style={{
                        background: 'rgba(40,167,69,0.15)',
                        border: '1px solid rgba(40,167,69,0.3)',
                        borderRadius: '14px',
                        padding: '12px 16px',
                        textAlign: 'center',
                        color: '#2ecc71',
                        fontWeight: 600,
                        fontSize: '14px',
                        marginBottom: '12px',
                        animation: 'fadeIn 0.3s ease'
                    }}>
                        {resendSuccess}
                    </div>
                )}

                {/* Resend */}
                <div style={{
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '14px',
                }}>
                    {canResend ? (
                        <button
                            onClick={handleResend}
                            disabled={resendLoading}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: resendLoading ? 'rgba(255,255,255,0.3)' : '#667eea',
                                cursor: resendLoading ? 'not-allowed' : 'pointer',
                                fontWeight: 700,
                                fontSize: '14px',
                                textDecoration: 'underline',
                            }}
                        >
                            {resendLoading ? '⏳ Sending...' : 'Resend verification code'}
                        </button>
                    ) : (
                        <span>
                            Resend code in{' '}
                            <strong style={{ color: '#667eea' }}>{resendCooldown}s</strong>
                        </span>
                    )}
                </div>

                <div className="auth-footer" style={{ marginTop: '20px' }}>
                    <p>Didn't receive the code? Check your spam folder.</p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtpPage;
