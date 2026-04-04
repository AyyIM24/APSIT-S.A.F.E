import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api, { authService } from '../../services/api';

/**
 * AdminLoginPage — admin must enter credentials before accessing dashboard.
 */
const AdminLoginPage = () => {
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
      const response = await api.post('/auth/admin/login', { email, password });
      authService.setAuth(response.data.token, { email, role: 'ROLE_ADMIN' });
      
      setLoading(false);
      setLoginSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 1200);
    } catch (err) {
      setLoading(false);
      setError('Invalid admin credentials. Access Denied.');
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
                  background: 'linear-gradient(135deg, #120058 0%, #764ba2 100%)',
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
                  initial={{ scale: 0, opacity: 0, rotate: 45 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
                  style={{ fontSize: '4rem' }}
              >
                  🔐
              </motion.div>
              <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
              >
                  Admin Access Granted
              </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`auth-card anim-formRise ${loginSuccess ? 'hidden' : ''}`} style={{ maxWidth: '460px' }}>
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
