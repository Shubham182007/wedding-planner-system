import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import PublicInquiry from './PublicInquiry';
import Navbar from './Navbar';

const LandingPage = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const badgeRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const cardsRef = useRef([]);

  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    // GSAP Entrance Animation
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.1 } });

    tl.fromTo(badgeRef.current, { y: -25, opacity: 0 }, { y: 0, opacity: 1, delay: 0.2 })
      .fromTo(titleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.7')
      .fromTo(subtitleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1 }, '-=0.6')
      .fromTo(ctaRef.current, { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1 }, '-=0.5');

    gsap.fromTo(
      cardsRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power2.out', delay: 0.3 }
    );
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'How does the client inquiry process work without user registration?',
      a: 'We operate as a full-service agency. Couples simply submit their event vision, tentative date, and financial parameters via our public portal. Our senior wedding architects process the request and manage all operational data, guest matrices, and vendor liaisons internally.',
    },
    {
      q: 'How does your financial allocation model prevent budget overruns?',
      a: 'Our algorithmic budget engine analyzes your total financial ceiling and dynamically computes optimal expenditure limits across catering tiers, venue rentals, floral staging, entertainment, and photography.',
    },
    {
      q: 'Can we accommodate complex guest seating requirements?',
      a: 'Absolutely. Our Admin Management Suite maintains real-time category tagging (VIPs, Bride Family, Groom Family, International Guests) linked directly to interactive reception table mapping.',
    },
    {
      q: 'What level of vendor oversight does your team provide?',
      a: 'We manage full vendor lifecycle procurement—from contract negotiation and deliverable timelines to payment logs and on-day execution schedules.',
    },
  ];

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", color: '#2a1a10', backgroundColor: '#fcfaf7', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* ROYAL WEDDING THEMED NAVBAR */}
      <Navbar />

      {/* FULL SCREEN HERO VIDEO SECTION */}
      <div 
        ref={heroRef}
        style={{ 
          position: 'relative',
          width: '100%',
          height: '100vh', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: '#1c100b'
        }}
      >
        {/* Background Fullscreen Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }}
        >
          <source src="/wedding-reel.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Gradient Overlay for Contrast */}
        <div 
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(28, 16, 11, 0.70) 0%, rgba(28, 16, 11, 0.50) 50%, rgba(28, 16, 11, 0.88) 100%)',
            zIndex: 1
          }} 
        />

        {/* Hero Content Over Video */}
        <div 
          style={{ 
            position: 'relative', 
            zIndex: 2, 
            textAlign: 'center', 
            color: '#ffffff', 
            padding: '0 20px', 
            maxWidth: '920px',
            marginTop: '40px'
          }}
        >
          {/* Luxury Badge */}
          <div ref={badgeRef} style={{ display: 'inline-block', marginBottom: '22px' }}>
            <span style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.12)', 
              backdropFilter: 'blur(10px)',
              color: '#fef08a', 
              border: '1px solid rgba(254, 240, 138, 0.4)',
              fontSize: '11px', 
              fontWeight: '700', 
              padding: '9px 26px', 
              borderRadius: '30px', 
              letterSpacing: '2.5px',
              textTransform: 'uppercase',
              fontFamily: 'sans-serif'
            }}>
              BESPOKE WEDDING ARCHITECTURE & MANAGEMENT
            </span>
          </div>
          
          {/* Hero Title */}
          <h1 
            ref={titleRef} 
            style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 4.2rem)', 
              fontWeight: '400', 
              marginTop: '8px', 
              marginBottom: '22px', 
              lineHeight: '1.15', 
              color: '#ffffff',
              letterSpacing: '-0.5px',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}
          >
            Where Royal Visions Become <br />
            <span style={{ fontStyle: 'italic', color: '#fecdd3', fontWeight: '400' }}>
              Seamless Realities.
            </span>
          </h1>
          
          {/* Hero Subtitle */}
          <p 
            ref={subtitleRef} 
            style={{ 
              fontSize: 'clamp(1rem, 2vw, 1.25rem)', 
              color: '#f3f4f6', 
              maxWidth: '760px', 
              margin: '0 auto 38px auto', 
              lineHeight: '1.75',
              fontFamily: 'sans-serif',
              fontWeight: '300',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            We unite haute event design with rigorous operational precision. From bespoke vendor procurement to dynamic guest seat mapping and algorithmic financial control, our agency orchestrates perfection.
          </p>

          {/* Action Buttons */}
          <div ref={ctaRef} style={{ display: 'flex', gap: '18px', justifyContent: 'center', flexWrap: 'wrap', fontFamily: 'sans-serif' }}>
            <a 
              href="#inquiry-form" 
              style={{
                backgroundColor: '#9f1239',
                color: '#ffffff',
                fontWeight: '700',
                padding: '18px 40px',
                borderRadius: '30px',
                textDecoration: 'none',
                fontSize: '15px',
                letterSpacing: '0.5px',
                boxShadow: '0 12px 28px -6px rgba(159, 18, 57, 0.6)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              Request Private Consultation 💐
            </a>
            
            <a 
              href="#capabilities" 
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontWeight: '600',
                padding: '18px 32px',
                borderRadius: '30px',
                textDecoration: 'none',
                fontSize: '15px',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)')}
            >
              Explore Services ⚜️
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div 
          style={{ 
            position: 'absolute', 
            bottom: '25px', 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 2, 
            color: 'rgba(255,255,255,0.7)',
            fontSize: '12px',
            fontFamily: 'sans-serif',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            textAlign: 'center',
            pointerEvents: 'none'
          }}
        >
          Scroll To Discover
          <div style={{ fontSize: '18px', marginTop: '4px' }}>↓</div>
        </div>
      </div>

      {/* AGENCY CREDENTIALS BAR */}
      <div style={{ backgroundColor: '#faf3ed', padding: '40px 20px', borderBottom: '1px solid #ebd8cb' }}>
        <div 
          ref={statsRef}
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: '24px', 
            maxWidth: '1100px', 
            margin: '0 auto', 
            backgroundColor: '#ffffff',
            border: '1px solid #f0e2d8',
            borderRadius: '24px',
            padding: '32px 24px',
            boxShadow: '0 20px 40px -15px rgba(107, 81, 67, 0.08)',
            fontFamily: 'sans-serif',
            textAlign: 'center'
          }}
        >
          <div>
            <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#9f1239' }}>₹25Cr+</div>
            <div style={{ fontSize: '11px', color: '#8c6e5d', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '6px', fontWeight: '700' }}>Event Portfolios</div>
          </div>
          <div>
            <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#b45309' }}>450+</div>
            <div style={{ fontSize: '11px', color: '#8c6e5d', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '6px', fontWeight: '700' }}>Curated Celebrations</div>
          </div>
          <div>
            <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#047857' }}>100%</div>
            <div style={{ fontSize: '11px', color: '#8c6e5d', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '6px', fontWeight: '700' }}>On-Time Execution</div>
          </div>
          <div>
            <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#6d28d9' }}>50+</div>
            <div style={{ fontSize: '11px', color: '#8c6e5d', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '6px', fontWeight: '700' }}>Luxury Venue Partners</div>
          </div>
        </div>
      </div>

      {/* COMPARISON SECTION */}
      <div style={{ maxWidth: '1100px', margin: '90px auto 40px auto', padding: '0 24px', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px', color: '#9f1239', textTransform: 'uppercase' }}>Why Choose Agency Management</span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '400', color: '#1c100b', marginTop: '8px', fontFamily: 'Georgia, serif' }}>
            Traditional DIY Planning vs. Our Agency Standard
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          
          <div style={{ backgroundColor: '#fff5f5', padding: '36px', borderRadius: '20px', border: '1px solid #fecdd3' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#9f1239', marginBottom: '16px', fontFamily: 'Georgia, serif' }}>❌ Traditional Planning</h3>
            <ul style={{ paddingLeft: '20px', color: '#6b5143', fontSize: '14px', lineHeight: '2.1' }}>
              <li>Disorganized spreadsheets and lost RSVP emails</li>
              <li>Unpredictable budget creeping and hidden vendor fees</li>
              <li>Chaotic seating layouts on the day of the event</li>
              <li>High emotional stress for the bride, groom, and family</li>
            </ul>
          </div>

          <div style={{ backgroundColor: '#f0fdf4', padding: '36px', borderRadius: '20px', border: '1px solid #bbf7d0' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#047857', marginBottom: '16px', fontFamily: 'Georgia, serif' }}>✅ Our Agency Standard</h3>
            <ul style={{ paddingLeft: '20px', color: '#374151', fontSize: '14px', lineHeight: '2.1' }}>
              <li>Centralized admin portal managing guests and seating</li>
              <li>AI-driven budget prediction preventing overspending</li>
              <li>Dedicated senior planners handling all vendor liaisons</li>
              <li>Total peace of mind with 100% turnkey execution</li>
            </ul>
          </div>

        </div>
      </div>

      {/* CORE CAPABILITIES SECTION */}
      <div id="capabilities" style={{ maxWidth: '1200px', margin: '90px auto', padding: '0 24px', scrollMarginTop: '100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '55px' }}>
          <span style={{ color: '#b45309', fontSize: '20px' }}>⚜️</span>
          <h2 style={{ fontSize: '2.6rem', fontWeight: '400', color: '#1c100b', marginTop: '6px', marginBottom: '12px' }}>
            Enterprise Operational Capabilities
          </h2>
          <p style={{ color: '#6b5143', fontSize: '1.1rem', maxWidth: '620px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            Our proprietary administration platform equips planners with micro-level control over every facet of your event.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px', fontFamily: 'sans-serif' }}>
          
          {[
            { icon: '📊', title: 'Algorithmic Financial Modeling', desc: 'Predictive budget allocation across venue rentals, catering tiers, floral staging, and media coverage.', color: '#047857' },
            { icon: '🥂', title: 'Dynamic Guest Architecture', desc: 'Real-time category breakdown for Bride Side, Groom Side, and VIPs with party size and RSVP tracking.', color: '#9f1239' },
            { icon: '🪑', title: 'Interactive Seating Matrix', desc: 'Custom table assignment engine ensuring VIPs and immediate family receive optimal reception placement.', color: '#b45309' },
            { icon: '🏰', title: 'Vendor Procurement & Liaison', desc: 'Centralized directory regulating contract deliverables, setup schedules, and payment ledgers.', color: '#6d28d9' },
          ].map((feature, idx) => (
            <div 
              key={idx}
              ref={(el) => (cardsRef.current[idx] = el)}
              style={{
                backgroundColor: '#ffffff',
                padding: '38px 28px',
                borderRadius: '24px',
                border: '1px solid #f0e2d8',
                boxShadow: '0 8px 30px -8px rgba(107, 81, 67, 0.05)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = feature.color;
                e.currentTarget.style.boxShadow = `0 18px 35px -10px ${feature.color}22`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#f0e2d8';
                e.currentTarget.style.boxShadow = '0 8px 30px -8px rgba(107, 81, 67, 0.05)';
              }}
            >
              <div style={{ fontSize: '42px', marginBottom: '18px' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#1c100b', fontFamily: 'Georgia, serif' }}>{feature.title}</h3>
              <p style={{ color: '#6b5143', fontSize: '14px', lineHeight: '1.65' }}>{feature.desc}</p>
            </div>
          ))}

        </div>
      </div>

      {/* PROVEN EXECUTION WORKFLOW */}
      <div style={{ backgroundColor: '#f7eae1', color: '#1c100b', padding: '90px 24px', borderTop: '1px solid #ebd8cb', borderBottom: '1px solid #ebd8cb' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px', color: '#9f1239', textTransform: 'uppercase', fontFamily: 'sans-serif' }}>The Journey</span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '400', marginTop: '6px', marginBottom: '12px' }}>Turnkey Event Management Workflow</h2>
          <p style={{ color: '#6b5143', marginBottom: '55px', fontFamily: 'sans-serif' }}>Three structured phases from initial inquiry to flawless execution.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', fontFamily: 'sans-serif' }}>
            
            <div style={{ backgroundColor: '#ffffff', padding: '36px 26px', borderRadius: '24px', border: '1px solid #ebd8cb', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#9f1239', color: '#ffffff', fontWeight: '800', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>1</div>
              <h3 style={{ fontSize: '19px', fontWeight: '700', marginBottom: '10px', fontFamily: 'Georgia, serif' }}>1. Private Consultation</h3>
              <p style={{ fontSize: '14px', color: '#6b5143', lineHeight: '1.65' }}>Couples submit event preferences, expected guest counts, and target financial parameters via our inquiry portal.</p>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '36px 26px', borderRadius: '24px', border: '1px solid #ebd8cb', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#b45309', color: '#ffffff', fontWeight: '800', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>2</div>
              <h3 style={{ fontSize: '19px', fontWeight: '700', marginBottom: '10px', fontFamily: 'Georgia, serif' }}>2. Curation & Setup</h3>
              <p style={{ fontSize: '14px', color: '#6b5143', lineHeight: '1.65' }}>Our lead planners construct your project workspace, modeling budget parameters, seating logic, and vendor contracts.</p>
            </div>

            <div style={{ backgroundColor: '#ffffff', padding: '36px 26px', borderRadius: '24px', border: '1px solid #ebd8cb', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#047857', color: '#ffffff', fontWeight: '800', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>3</div>
              <h3 style={{ fontSize: '19px', fontWeight: '700', marginBottom: '10px', fontFamily: 'Georgia, serif' }}>3. On-Site Orchestration</h3>
              <p style={{ fontSize: '14px', color: '#6b5143', lineHeight: '1.65' }}>Our on-day executive staff manages guest welcomes, vendor timelines, catering schedules, and seating flow live.</p>
            </div>

          </div>
        </div>
      </div>

      {/* CURATED CASE STUDIES / REVIEWS */}
      <div id="case-studies" style={{ maxWidth: '1100px', margin: '90px auto', padding: '0 24px', scrollMarginTop: '100px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: '400', marginBottom: '45px', color: '#1c100b' }}>Client Case Studies</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', fontFamily: 'sans-serif' }}>
          
          <div style={{ backgroundColor: '#ffffff', padding: '36px', borderRadius: '24px', border: '1px solid #f0e2d8', boxShadow: '0 12px 35px -12px rgba(107, 81, 67, 0.08)' }}>
            <div style={{ color: '#b45309', fontSize: '18px', marginBottom: '12px' }}>★★★★★</div>
            <p style={{ color: '#4a3b32', fontStyle: 'italic', marginBottom: '22px', lineHeight: '1.75', fontSize: '15px' }}>
              "Managing a 450-guest destination wedding in Udaipur felt effortless. The agency's budget modeling tool and automated guest categorization prevented any overspending while keeping seating completely organized."
            </p>
            <div style={{ fontWeight: '700', color: '#1c100b', fontFamily: 'Georgia, serif', fontSize: '16px' }}>The Oberoi Destination Wedding</div>
            <div style={{ fontSize: '12px', color: '#8c6e5d', marginTop: '2px' }}>Ananya & Rahul • Udaipur</div>
          </div>

          <div style={{ backgroundColor: '#ffffff', padding: '36px', borderRadius: '24px', border: '1px solid #f0e2d8', boxShadow: '0 12px 35px -12px rgba(107, 81, 67, 0.08)' }}>
            <div style={{ color: '#b45309', fontSize: '18px', marginBottom: '12px' }}>★★★★★</div>
            <p style={{ color: '#4a3b32', fontStyle: 'italic', marginBottom: '22px', lineHeight: '1.75', fontSize: '15px' }}>
              "The level of structure was unbelievable. Their admin team took care of vendor scheduling, guest RSVP headcounts, and stage decor timelines down to the minute."
            </p>
            <div style={{ fontWeight: '700', color: '#1c100b', fontFamily: 'Georgia, serif', fontSize: '16px' }}>Royal Palace Celebration</div>
            <div style={{ fontSize: '12px', color: '#8c6e5d', marginTop: '2px' }}>Priya & Siddharth • Mumbai</div>
          </div>

        </div>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <div id="faqs" style={{ backgroundColor: '#faf3ed', padding: '80px 24px', borderTop: '1px solid #ebd8cb', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', fontFamily: 'sans-serif' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.4rem', fontWeight: '400', marginBottom: '40px', color: '#1c100b', fontFamily: 'Georgia, serif' }}>Frequently Asked Questions</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                onClick={() => toggleFaq(i)}
                style={{ 
                  backgroundColor: '#ffffff', 
                  borderRadius: '18px', 
                  padding: '22px 28px', 
                  cursor: 'pointer',
                  border: '1px solid #e8d7cb',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '700', fontSize: '16px', color: '#1c100b' }}>
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '22px', color: '#9f1239', fontWeight: 'bold' }}>{openFaq === i ? '−' : '+'}</span>
                </div>
                {openFaq === i && (
                  <p style={{ marginTop: '16px', color: '#6b5143', fontSize: '14px', lineHeight: '1.75', borderTop: '1px solid #f7eae1', paddingTop: '16px' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* EMBEDDED INQUIRY FORM */}
      <div id="inquiry-form" style={{ padding: '90px 24px', backgroundColor: '#ffffff', scrollMarginTop: '80px' }}>
        <PublicInquiry />
      </div>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#1c100b', color: '#d7ccc8', textAlign: 'center', padding: '40px 20px', fontSize: '13px', fontFamily: 'sans-serif' }}>
        <p style={{ margin: 0, letterSpacing: '0.5px' }}>© {new Date().getFullYear()} WedSync Wedding Architecture. Engineered with Operational Excellence.</p>
      </footer>

    </div>
  );
};

export default LandingPage;