import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('selectedClientId');
    navigate('/admin/login');
  };

  const adminNavs = [
    { name: '📊 Dashboard', path: '/dashboard' },
    { name: '👥 Guests', path: '/guests' },
    { name: '📅 Events', path: '/events' },
    { name: '🏢 Vendors', path: '/vendors' },
    { name: '💰 Budget', path: '/budget' },
    { name: '🤖 AI Budget', path: '/ai-budget' },
    { name: '🪑 Seating', path: '/seating' },
    { name: '📈 Reports', path: '/reports' },
  ];

  return (
    <header style={{ backgroundColor: '#1c100b', color: '#fff', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', padding: '12px 24px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>

        {/* BRAND TITLE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            aria-hidden="true"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px 8px 8px 2px',
              backgroundColor: '#fef08a',
              color: '#1c100b',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Georgia, serif',
              fontSize: '11px',
              fontWeight: '800',
              letterSpacing: '0',
              boxShadow: '3px 3px 0 rgba(159, 18, 57, 0.8)',
            }}
          >
            WS
          </span>
          <h2 style={{ fontFamily: 'Georgia, serif', margin: 0, fontSize: '1.1rem', color: '#ffffff' }}>
            WedSync <span style={{ fontSize: '11px', color: '#fef08a', textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Console</span>
          </h2>
        </div>

        {/* MODULE LINKS */}
        <nav style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {adminNavs.map((nav) => {
            const isActive = location.pathname === nav.path;
            return (
              <Link
                key={nav.path}
                to={nav.path}
                style={{
                  color: isActive ? '#1c100b' : '#fcfaf7',
                  backgroundColor: isActive ? '#fef08a' : 'rgba(255, 255, 255, 0.08)',
                  textDecoration: 'none',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                }}
              >
                {nav.name}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#9f1239',
            color: '#ffffff',
            border: 'none',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer',
          }}
        >
          Logout 🔒
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;