import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.email === 'admin@wedsync.com' && credentials.password === 'admin123') {
      navigate('/admin/dashboard'); // Redirects to Admin Dashboard
    } else {
      setError('Invalid credentials. Please check your email and password.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1c100b', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#281812', borderRadius: '16px', padding: '36px 28px', border: '1px solid rgba(212, 175, 55, 0.3)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '32px' }}>🔒</span>
          <h2 style={{ color: '#ffffff', fontFamily: 'Georgia, serif', marginTop: '10px', marginBottom: '6px' }}>Staff Portal</h2>
          <p style={{ color: '#b3a296', fontSize: '13px', margin: 0 }}>Authorized Personnel Only</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(153, 27, 27, 0.2)', border: '1px solid #991b1b', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '20px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', color: '#fef08a', fontSize: '12px', fontWeight: '700', marginBottom: '6px', letterSpacing: '1px' }}>ADMIN EMAIL</label>
            <input
              type="email"
              name="email"
              required
              placeholder="admin@wedsync.com"
              value={credentials.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.15)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', color: '#fef08a', fontSize: '12px', fontWeight: '700', marginBottom: '6px', letterSpacing: '1px' }}>PASSWORD</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={credentials.password}
              onChange={handleChange}
              style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.15)', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: '#ffffff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" style={{ width: '100%', backgroundColor: '#9f1239', color: '#ffffff', border: '1px solid rgba(254, 240, 138, 0.4)', padding: '12px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', letterSpacing: '1px' }}>
            Authenticate & Access
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#8c766b', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>
            ← Back to Main Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;