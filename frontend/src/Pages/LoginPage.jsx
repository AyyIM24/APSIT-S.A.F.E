import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin, setIsLoggedIn, isLoggedIn }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await onLogin({ email, password });
            setLoading(false);
            navigate('/discovery');
        } catch (err) {
            setLoading(false);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError('Invalid email or password.');
            } else {
                setError('Login failed. Please try again.');
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card anim-formRise">
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
                                placeholder="student@apsit.edu.in"
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