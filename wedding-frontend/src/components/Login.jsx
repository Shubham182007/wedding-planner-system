import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 🔑 FIXED ADMIN CREDENTIALS
  const ADMIN_EMAIL = 'admin@wedsync.com';
  const ADMIN_PASSWORD = 'admin123';

  const handleLogin = (e) => {
    e.preventDefault();

    // Validate credentials
    if (email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Save auth state to browser session
      localStorage.setItem('isAdminAuthenticated', 'true');
      setError('');
      
      // Redirect directly to the central Admin Dashboard
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#1c100b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          backgroundColor: '#281812',
          borderRadius: '16px',
          padding: '40px 30px',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '32px' }}>🔒</span>
          <h2 style={{ color: '#ffffff', fontFamily: 'Georgia, serif', marginTop: '10px', marginBottom: '6px' }}>
            Staff Portal
          </h2>
          <p style={{ color: '#b3a296', fontSize: '13px', margin: 0 }}>
            Authorized Personnel Only
          </p>
        </div>

        {/* ERROR MESSAGE ALERT */}
        {error && (
          <div
            style={{
              backgroundColor: 'rgba(153, 27, 27, 0.25)',
              border: '1px solid #991b1b',
              color: '#fca5a5',
              padding: '12px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#fef08a', fontSize: '11px', fontWeight: '700', marginBottom: '8px', letterSpacing: '1px' }}>
              ADMIN EMAIL
            </label>
            <input
              type="email"
              required
              // placeholder="admin@wedsync.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', color: '#fef08a', fontSize: '11px', fontWeight: '700', marginBottom: '8px', letterSpacing: '1px' }}>
              PASSWORD
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#9f1239',
              color: '#ffffff',
              border: '1px solid rgba(254, 240, 138, 0.4)',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              transition: 'background-color 0.2s ease',
            }}
          >
            Authenticate & Access
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#8c766b',
              fontSize: '12px',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          > 
            ← Back to Main Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;