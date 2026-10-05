import React, { useState } from 'react';

const PublicInquiry = () => {
  const [formData, setFormData] = useState({
    coupleName: '',
    email: '',
    phone: '',
    eventDate: '',
    estimatedBudget: '',
    guestCount: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newInquiry = {
      id: Date.now(),
      ...formData,
      status: 'NEW',
      submittedAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    try {
      // 1. Send data to the backend and use its database ID for the active wedding
      const response = await fetch('https://wedding-planner-backend-zjgi.onrender.com/api/public/wedding-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couple_name: formData.coupleName,
          contact_email: formData.email,
          contact_phone: formData.phone,
          event_date: formData.eventDate,
          estimated_guests: formData.guestCount,
          estimated_budget: formData.estimatedBudget,
        }),
      }).catch(() => {
        console.log('Backend server offline; saved locally for admin demo view.');
      });

      if (response?.ok) {
        const result = await response.json();
        newInquiry.clientId = result.id;
        newInquiry.userId = result.userId;
      }

      // 2. Save to local storage for instant sync with Admin Dashboard
      const existingInquiries = JSON.parse(localStorage.getItem('wedding_inquiries') || '[]');
      const updatedInquiries = [newInquiry, ...existingInquiries];
      localStorage.setItem('wedding_inquiries', JSON.stringify(updatedInquiries));

      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        style={{
          maxWidth: '650px',
          margin: '0 auto',
          padding: '50px 30px',
          backgroundColor: '#1c100b',
          borderRadius: '20px',
          border: '1px solid rgba(212, 175, 55, 0.4)',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>👑</div>
        <h3
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '2rem',
            color: '#ffffff',
            margin: '0 0 12px',
          }}
        >
          Consultation Request Received
        </h3>
        <p style={{ color: '#b3a296', fontSize: '15px', lineHeight: '1.6', margin: '0 0 24px' }}>
          Thank you, <strong style={{ color: '#fef08a' }}>{formData.coupleName}</strong>. Our senior wedding architect will review your vision and contact you at <strong style={{ color: '#fff' }}>{formData.phone}</strong> shortly.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({
              coupleName: '',
              email: '',
              phone: '',
              eventDate: '',
              estimatedBudget: '',
              guestCount: '',
              notes: '',
            });
          }}
          style={{
            background: 'none',
            border: '1px solid rgba(254, 240, 138, 0.4)',
            color: '#fef08a',
            padding: '10px 24px',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '12px',
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: '700px',
        margin: '0 auto',
        backgroundColor: '#281812',
        borderRadius: '20px',
        padding: '40px 32px',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        color: '#ffffff',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: '800',
            letterSpacing: '3px',
            color: '#fef08a',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          Private Consultation
        </span>
        <h2
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '2rem',
            margin: '0 0 8px',
            color: '#ffffff',
          }}
        >
          Begin Planning Your Wedding
        </h2>
        <p style={{ color: '#b3a296', fontSize: '14px', margin: 0 }}>
          Share your details below and let our royal architects craft your celebration.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* COUPLE NAME */}
        <div>
          <label style={{ display: 'block', color: '#fef08a', fontSize: '11px', fontWeight: '700', marginBottom: '6px', letterSpacing: '1px' }}>
            COUPLE NAMES *
          </label>
          <input
            type="text"
            name="coupleName"
            required
            placeholder="e.g. Ananya & Rohan"
            value={formData.coupleName}
            onChange={handleChange}
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

        {/* EMAIL & PHONE */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#fef08a', fontSize: '11px', fontWeight: '700', marginBottom: '6px', letterSpacing: '1px' }}>
              EMAIL ADDRESS *
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="e.g. rohan@example.com"
              value={formData.email}
              onChange={handleChange}
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
          <div>
            <label style={{ display: 'block', color: '#fef08a', fontSize: '11px', fontWeight: '700', marginBottom: '6px', letterSpacing: '1px' }}>
              PHONE NUMBER *
            </label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
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
        </div>

        {/* DATE & BUDGET */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#fef08a', fontSize: '11px', fontWeight: '700', marginBottom: '6px', letterSpacing: '1px' }}>
              TARGET EVENT DATE *
            </label>
            <input
              type="date"
              name="eventDate"
              required
              value={formData.eventDate}
              onChange={handleChange}
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
          <div>
            <label style={{ display: 'block', color: '#fef08a', fontSize: '11px', fontWeight: '700', marginBottom: '6px', letterSpacing: '1px' }}>
              ESTIMATED BUDGET (₹)
            </label>
            <input
              type="number"
              name="estimatedBudget"
              placeholder="e.g. 2500000"
              value={formData.estimatedBudget}
              onChange={handleChange}
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
        </div>

        {/* GUEST COUNT & NOTES */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#fef08a', fontSize: '11px', fontWeight: '700', marginBottom: '6px', letterSpacing: '1px' }}>
              ESTIMATED GUEST COUNT
            </label>
            <input
              type="number"
              name="guestCount"
              placeholder="e.g. 300"
              value={formData.guestCount}
              onChange={handleChange}
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

          <div>
            <label style={{ display: 'block', color: '#fef08a', fontSize: '11px', fontWeight: '700', marginBottom: '6px', letterSpacing: '1px' }}>
              ADDITIONAL VISION / NOTES
            </label>
            <textarea
              name="notes"
              rows="3"
              placeholder="Tell us about preferred destinations, themes, or special requirements..."
              value={formData.notes}
              onChange={handleChange}
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
                resize: 'vertical',
              }}
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: '#9f1239',
            color: '#ffffff',
            border: '1px solid rgba(254, 240, 138, 0.4)',
            padding: '14px',
            borderRadius: '8px',
            fontWeight: '700',
            fontSize: '13px',
            cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginTop: '8px',
            transition: 'all 0.2s ease',
          }}
        >
          {loading ? 'Submitting...' : 'Request Private Consultation 💐'}
        </button>
      </form>
    </div>
  );
};

export default PublicInquiry;