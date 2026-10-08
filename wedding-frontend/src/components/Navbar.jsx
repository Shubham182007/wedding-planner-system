import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 1. ALL HOOKS MUST BE CALLED AT THE TOP LEVEL
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. CHECK IF NAVBAR SHOULD BE HIDDEN (AFTER ALL HOOKS)
  const hideNavbarOn = ['/login', '/guests', '/admin/dashboard'];
  if (hideNavbarOn.includes(location.pathname)) {
    return null; // Safely hide Navbar without breaking Hook order
  }

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'Capabilities', href: '/#capabilities' },
    // { name: 'Experience Film', href: '/#showcase-video' },
    { name: 'Consultation', href: '/#inquiry-form' },
    { name: 'Admin Portal', href: '/login', isRouterLink: true },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.4s ease',
        backgroundColor: isScrolled ? 'rgba(28, 16, 11, 0.85)' : 'rgba(28, 16, 11, 0.4)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: isScrolled ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(255, 255, 255, 0.15)',
        padding: isScrolled ? '14px 0' : '22px 0',
      }}
    >
      <div className="navbar-container">
        {/* BRAND LOGO */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            aria-hidden="true"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px 10px 10px 2px',
              backgroundColor: '#fef08a',
              color: '#1c100b',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Georgia, serif',
              fontSize: '13px',
              fontWeight: '800',
              letterSpacing: '0',
              boxShadow: '4px 4px 0 rgba(159, 18, 57, 0.8)',
            }}
          >
            WS
          </span>
          <div>
            <span style={{ fontFamily: "'Georgia', serif", fontSize: '1.25rem', fontWeight: '700', letterSpacing: '1.5px', color: '#ffffff', display: 'block', textTransform: 'uppercase' }}>
              WedSync
            </span>
          </div>
        </Link>

        <button
          className="navbar-menu-toggle"
          type="button"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          id="primary-navigation"
          className={`navbar-navigation${isMenuOpen ? ' is-open' : ''}`}
          aria-label="Primary navigation"
        >
          {navLinks.map((link, index) =>
            link.isRouterLink ? (
              <Link
                key={index}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  color: '#fef08a',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: '600',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(254, 240, 138, 0.4)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                }}
              >
                🔒 {link.name}
              </Link>
            ) : (
              <a
                key={index}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: '500',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                }}
              >
                {link.name}
              </a>
            )
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;