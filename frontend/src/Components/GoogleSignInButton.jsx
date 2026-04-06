import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { authService } from '../services/api';

const GoogleSignInButton = ({ setIsLoggedIn, onLogin }) => {
    const buttonRef = useRef(null);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
        if (!clientId) {
            console.error('REACT_APP_GOOGLE_CLIENT_ID not set in .env');
            return;
        }

        // Wait for Google Identity Services script to load
        const initGoogle = () => {
            if (window.google && window.google.accounts) {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse,
                    auto_select: false,
                });

                if (buttonRef.current) {
                    window.google.accounts.id.renderButton(buttonRef.current, {
                        theme: 'outline',
                        size: 'large',
                        text: 'signin_with',
                        shape: 'pill',
                        width: '100%',
                    });
                }
            } else {
                // Script not loaded yet, retry after a short delay
                setTimeout(initGoogle, 200);
            }
        };

        initGoogle();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCredentialResponse = async (response) => {
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/auth/google', { idToken: response.credential });
            const data = res.data;

            // Save auth exactly like normal login
            authService.setAuth(data.token, {
                email: data.email,
                name: data.name,
                userId: data.userId,
                role: 'ROLE_USER',
            });

            if (onLogin) await onLogin();
            if (setIsLoggedIn) setIsLoggedIn(true);

            setLoading(false);
            navigate('/discovery');
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.status === 403) {
                setError(err.response.data?.error || 'Only APSIT college emails are allowed.');
            } else if (err.response && err.response.data?.error) {
                setError(err.response.data.error);
            } else {
                setError('Google sign-in failed. Please try again.');
            }
        }
    };

    return (
        <div style={{ width: '100%' }}>
            {loading && (
                <div style={{
                    textAlign: 'center',
                    padding: '12px',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '14px'
                }}>
                    <span className="auth-spinner"></span> Signing in with Google...
                </div>
            )}

            <div
                ref={buttonRef}
                style={{
                    display: loading ? 'none' : 'flex',
                    justifyContent: 'center',
                    width: '100%',
                }}
            />

            {error && (
                <div className="auth-error" style={{ marginTop: '12px' }}>
                    <span>⚠️</span> {error}
                </div>
            )}
        </div>
    );
};

export default GoogleSignInButton;
