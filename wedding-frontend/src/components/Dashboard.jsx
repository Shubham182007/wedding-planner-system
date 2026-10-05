import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ setActiveClientId }) => {
  const [inquiries, setInquiries] = useState([]);
  const navigate = useNavigate();

  // Load inquiries whenever Dashboard mounts
  useEffect(() => {
    const loadInquiries = async () => {
      const savedInquiries = JSON.parse(localStorage.getItem('wedding_inquiries') || '[]');

      try {
        const response = await fetch('https://wedding-planner-backend-zjgi.onrender.com/api/admin/client-weddings');
        if (response.ok) {
          const clients = await response.json();
          const migratedInquiries = savedInquiries.map((inquiry) => {
            const email = inquiry.email?.trim().toLowerCase();
            const client = clients.find((item) => item.contact_email?.trim().toLowerCase() === email);
            return { ...inquiry, clientId: client?.id };
          });
          setInquiries(migratedInquiries);
          localStorage.setItem('wedding_inquiries', JSON.stringify(migratedInquiries));
          return;
        }
      } catch (error) {
        console.error('Could not load database client IDs:', error);
      }

      setInquiries(savedInquiries);
    };

    loadInquiries();
  }, []);

  // Action: Convert an inquiry into an active client
  const handleManageWedding = async (inquiry) => {
    // Use the internal user ID for management tables while displaying the client ID.
    let activeClientId = inquiry.userId;
    if (!activeClientId) {
      try {
        const response = await fetch('https://wedding-planner-backend-zjgi.onrender.com/api/admin/resolve-client', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ couple_name: inquiry.coupleName, contact_email: inquiry.email }),
        });
        if (response.ok) {
          const result = await response.json();
          activeClientId = result.id;
        }
      } catch (error) {
        console.error('Could not resolve legacy couple ID:', error);
      }
    }

    localStorage.setItem('selectedClientId', activeClientId);
    if (setActiveClientId) {
      setActiveClientId(activeClientId);
    }

    if (!activeClientId) {
      return;
    }

    const updated = inquiries.map((item) =>
      item.id === inquiry.id ? { ...item, userId: activeClientId, status: 'ACCEPTED' } : item
    );
    setInquiries(updated);
    localStorage.setItem('wedding_inquiries', JSON.stringify(updated));

    // Mark status as "Active"
    navigate('/guests');
  };

  const handleDeleteInquiry = async (inquiry) => {
    const confirmed = window.confirm(`Delete the submission from ${inquiry.coupleName}?`);

    if (!confirmed) {
      return;
    }

    try {
      if (inquiry.clientId) {
        const response = await fetch(`https://wedding-planner-backend-zjgi.onrender.com/api/admin/client-weddings/${inquiry.clientId}`, {
          method: 'DELETE',
        });

        if (!response.ok && response.status !== 404) {
          const result = await response.json().catch(() => ({}));
          throw new Error(result.message || 'The couple could not be deleted from the database.');
        }
      }

      // Local-only and already-removed database inquiries can be cleared from the dashboard.
      const updatedInquiries = inquiries.filter((item) => item.id !== inquiry.id);
      setInquiries(updatedInquiries);
      localStorage.setItem('wedding_inquiries', JSON.stringify(updatedInquiries));
    } catch (error) {
      console.error('Delete inquiry error:', error);
      window.alert(error.message);
    }
  };

  const newInquiriesCount = inquiries.filter((i) => i.status === 'NEW').length;

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* WELCOME BANNER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', margin: 0, color: '#1c100b' }}>Admin Overview</h1>
          <p style={{ color: '#666', margin: '4px 0 0' }}>Welcome back. Here are your incoming wedding requests.</p>
        </div>
        
        {/* NEW INQUIRIES BADGE */}
        {newInquiriesCount > 0 && (
          <div style={{ backgroundColor: '#9f1239', color: '#fff', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px' }}>
            🔔 {newInquiriesCount} New Couple Request{newInquiriesCount > 1 ? 's' : ''}!
          </div>
        )}
      </div>

      {/* 📥 INCOMING COUPLE REQUESTS SECTION */}
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: '1px solid #eaeaea', marginBottom: '30px' }}>
        <h3 style={{ fontFamily: 'Georgia, serif', margin: '0 0 16px', color: '#1c100b', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>📩</span> Recent Couple Submissions ({inquiries.length})
        </h3>

        {inquiries.length === 0 ? (
          <p style={{ color: '#888', fontStyle: 'italic' }}>No couple has filled out the form yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0', color: '#888' }}>
                  <th style={{ padding: '12px' }}>Request #</th>
                  <th style={{ padding: '12px' }}>Couple Details</th>
                  <th style={{ padding: '12px' }}>Contact</th>
                  <th style={{ padding: '12px' }}>Event Date</th>
                  <th style={{ padding: '12px' }}>Budget</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((item, index) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f9f9f9', backgroundColor: item.status === 'NEW' ? '#fffbeb' : 'transparent' }}>
                    
                    {/* CLIENT ID */}
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#9f1239' }}>
                      #{index + 1}
                    </td>

                    {/* COUPLE NAME */}
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#1c100b' }}>
                      {item.coupleName}
                      <br />
                      <small style={{ color: '#888', fontWeight: 'normal' }}>Submitted: {item.submittedAt}</small>
                    </td>

                    {/* CONTACT */}
                    <td style={{ padding: '14px 12px' }}>
                      {item.email} <br />
                      <span style={{ color: '#666', fontSize: '12px' }}>{item.phone}</span>
                    </td>

                    {/* DATE */}
                    <td style={{ padding: '14px 12px' }}>{item.eventDate || 'TBD'}</td>

                    {/* BUDGET */}
                    <td style={{ padding: '14px 12px', fontWeight: 'bold', color: '#047857' }}>
                      {item.estimatedBudget ? `₹${Number(item.estimatedBudget).toLocaleString('en-IN')}` : 'N/A'}
                    </td>

                    {/* STATUS BADGE */}
                    <td style={{ padding: '14px 12px' }}>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          backgroundColor: item.status === 'NEW' ? '#fef08a' : '#d1fae5',
                          color: item.status === 'NEW' ? '#854d0e' : '#065f46',
                        }}
                      >
                        {item.status === 'NEW' ? '🔥 NEW REQUEST' : '✅ ACTIVE'}
                      </span>
                    </td>

                    {/* ACTION BUTTON */}
                    <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleManageWedding(item)}
                        style={{
                          backgroundColor: '#1c100b',
                          color: '#fef08a',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        Manage Wedding →
                      </button>
                      <button
                        onClick={() => handleDeleteInquiry(item)}
                        style={{
                          backgroundColor: '#ffffff',
                          color: '#b91c1c',
                          border: '1px solid #fecaca',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;