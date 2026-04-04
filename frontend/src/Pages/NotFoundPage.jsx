import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="report-root">
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        textAlign: 'center',
        padding: '40px 20px'
      }}>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{ fontSize: '6rem', marginBottom: '10px' }}
        >
          🔍
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: '4rem',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '10px'
          }}
        >
          404
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '1.2rem',
            maxWidth: '400px',
            lineHeight: 1.6,
            marginBottom: '30px'
          }}
        >
          Oops! This page doesn't exist. It may have wandered off — just like a lost item.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <Link to="/" className="btn-gradient-card" style={{ padding: '12px 28px', textDecoration: 'none' }}>
            ← Go Home
          </Link>
          <Link to="/discovery" className="btn-gradient-card" style={{ padding: '12px 28px', textDecoration: 'none', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
            Discovery Hub →
          </Link>
        </motion.div>
      </main>
    </div>
  );
};

export default NotFoundPage;
