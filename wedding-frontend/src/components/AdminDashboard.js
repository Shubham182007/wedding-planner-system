import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [inquiries] = useState([
    { id: 1, bride: 'Ananya Sharma', groom: 'Rahul Verma', date: 'Dec 2026', guests: '100–300 guests', budget: '₹50L–₹1Cr', status: 'New Inquiry' },
    { id: 2, bride: 'Priya Mehta', groom: 'Rohan Kapoor', date: 'Spring 2027', guests: '300–600 guests', budget: '₹1Cr–₹3Cr', status: 'Contacted' },
  ]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fcfaf7', fontFamily: 'sans-serif', padding: '40px 24px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* DASHBOARD HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', borderBottom: '1px solid #ebd8cb', paddingBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '2px', color: '#9f1239', textTransform: 'uppercase' }}>Management Console</span>
            <h1 style={{ fontFamily: 'Georgia, serif', color: '#1c100b', margin: '4px 0 0' }}>Admin Dashboard</h1>
          </div>
          <button
            onClick={() => navigate('/admin/login')}
            style={{ backgroundColor: '#1c100b', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
          >
            Logout 🔒
          </button>
        </div>

        {/* INQUIRIES TABLE */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #f0e2d8', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', color: '#1c100b', marginBottom: '16px' }}>Couple Inquiry Submissions</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ backgroundColor: '#fcfaf7', borderBottom: '2px solid #f0e2d8', color: '#6b5143' }}>
                  <th style={{ padding: '12px' }}>Couple Names</th>
                  <th style={{ padding: '12px' }}>Proposed Date</th>
                  <th style={{ padding: '12px' }}>Guest Count</th>
                  <th style={{ padding: '12px' }}>Budget Range</th>
                  <th style={{ padding: '12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f0e2d8' }}>
                    <td style={{ padding: '14px', fontWeight: '600', color: '#1c100b' }}>{item.bride} & {item.groom}</td>
                    <td style={{ padding: '14px', color: '#6b5143' }}>{item.date}</td>
                    <td style={{ padding: '14px', color: '#6b5143' }}>{item.guests}</td>
                    <td style={{ padding: '14px', color: '#6b5143' }}>{item.budget}</td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ backgroundColor: item.status === 'New Inquiry' ? '#fef3c7' : '#d1fae5', color: item.status === 'New Inquiry' ? '#92400e' : '#065f46', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '700' }}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;