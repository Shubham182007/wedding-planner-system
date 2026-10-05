import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#1c100b',
        color: '#fcfaf7',
        padding: '60px 28px 24px',
        fontFamily: 'sans-serif',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          paddingBottom: '40px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        {/* BRAND COLUMN */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
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
            <span
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: '1.2rem',
                fontWeight: '700',
                letterSpacing: '1px',
                color: '#ffffff',
                textTransform: 'uppercase',
              }}
            >
              WedSync
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#b3a296', lineHeight: '1.6', margin: 0 }}>
            Crafting timeless, luxury wedding architectures and multi-day celebrations.
          </p>
        </div>

        {/* NAVIGATION LINKS */}
        <div>
          <h4 style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px', color: '#fef08a', textTransform: 'uppercase', marginBottom: '16px' }}>
            Explore
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <li><a href="#" style={footerLinkStyle}>Home</a></li>
            <li><a href="#capabilities" style={footerLinkStyle}>Capabilities</a></li>
            <li><a href="#case-studies" style={footerLinkStyle}>Client Stories</a></li>
            <li><a href="#inquiry-form" style={footerLinkStyle}>Book Consultation</a></li>
          </ul>
        </div>

        {/* CONTACT INFO */}
        <div>
          <h4 style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px', color: '#fef08a', textTransform: 'uppercase', marginBottom: '16px' }}>
            Connect
          </h4>
          <p style={{ fontSize: '13px', color: '#b3a296', lineHeight: '1.8', margin: 0 }}>
            📍 Mumbai • Udaipur • Jaipur • Goa<br />
            📧 concierge@wedsyncweddings.com<br />
            📞 +91 (022) 8000-CREST
          </p>
        </div>
      </div>

      {/* BOTTOM LEGAL BAR & DISCREET ADMIN LINK */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '12px',
          color: '#8c766b',
        }}
      >
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} WedSync Wedding Architecture. All rights reserved.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <a href="#privacy" style={secondaryLinkStyle}>Privacy Policy</a>
          <a href="#terms" style={secondaryLinkStyle}>Terms of Service</a>

          {/* DISCREET ADMIN LOGIN LINK */}
          <a
            href="/admin/login"
            style={{
              ...secondaryLinkStyle,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              opacity: 0.5,
              fontSize: '11px',
              borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
              paddingLeft: '16px',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.color = '#fef08a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.5';
              e.currentTarget.style.color = '#8c766b';
            }}
            title="Staff Management Portal"
          >
            <span>🔒</span> Staff Portal
          </a>
        </div>
      </div>
    </footer>
  );
};

const footerLinkStyle = {
  color: '#d4c5b9',
  textDecoration: 'none',
  transition: 'color 0.2s ease',
};

const secondaryLinkStyle = {
  color: '#8c766b',
  textDecoration: 'none',
  transition: 'color 0.2s ease',
};

export default Footer;