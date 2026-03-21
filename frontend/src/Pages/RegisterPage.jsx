import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const registerUser = async (user) => { return { data: { name: user.name } }; };

const RegisterPage = ({ isLoggedIn, setIsLoggedIn }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
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
            const response = await registerUser({ name, email, password });
            setLoading(false);
            alert(`Registration successful for ${response.data.name}!`);
            navigate('/login');
        } catch (err) {
            setLoading(false);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card anim-formRise">
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