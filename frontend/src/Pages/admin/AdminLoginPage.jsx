import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * AdminLoginPage — admin must enter credentials before accessing dashboard.
 */
const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Demo check
    setTimeout(() => {
      if (email === 'admin@apsit.edu.in' && password === 'admin123') {
        navigate('/admin');
      } else {
        setError('Invalid admin credentials. Try admin@apsit.edu.in / admin123');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="auth-page">
      <div className="auth-card anim-formRise" style={{ maxWidth: '460px' }}>
        <div className="auth-card-header">
          <div className="auth-icon">🛡️</div>
          <h1>Admin Login</h1>
          <p>APSIT S.A.F.E — Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="auth-error">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label>Admin Email</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">📧</span>
              <input
                type="email"
                placeholder="admin@apsit.edu.in"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">🔒</span>
              <input
                type="password"
                placeholder="Enter admin password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <><span className="auth-spinner"></span> Verifying...</>
            ) : (
              '🛡️ Access Dashboard →'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
            Demo credentials: admin@apsit.edu.in / admin123
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
