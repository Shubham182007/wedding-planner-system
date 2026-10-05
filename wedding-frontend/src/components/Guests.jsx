import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Guests = () => {
  // Get active client ID selected from the top Navbar (or fallback to logged-in user)
  const [activeClientId, setActiveClientId] = useState(
    localStorage.getItem('selectedClientId') || JSON.parse(localStorage.getItem('user'))?.id
  );

  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    guest_name: '',
    contact: '',
    category: 'General',
    total_members: 1,
    rsvp_status: 'Pending',
  });

  // Re-fetch guests whenever active client changes or component mounts
  useEffect(() => {
    // Listen for storage changes if user switches client in navbar
    const interval = setInterval(() => {
      const currentSelectedId = localStorage.getItem('selectedClientId');
      if (currentSelectedId && currentSelectedId !== activeClientId) {
        setActiveClientId(currentSelectedId);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [activeClientId]);

  useEffect(() => {
    if (activeClientId) {
      fetchGuests();
    }
  }, [activeClientId]);

  const fetchGuests = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5000/api/guests/${activeClientId}`);
      setGuests(response.data);
    } catch (err) {
      console.error('Error fetching guests:', err);
      setError(err.response?.data?.message || 'Failed to load guests for selected client');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const parsedClientId = Number(activeClientId);
    if (!activeClientId || !Number.isInteger(parsedClientId) || parsedClientId > 2147483647) {
      setError('No active wedding selected. Please select a client from the top dropdown.');
      return;
    }

    const payload = {
      user_id: parsedClientId,
      ...formData,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/guests', payload);
      setSuccessMessage(response.data.message || 'Guest added successfully!');
      
      // Reset form fields
      setFormData({
        guest_name: '',
        contact: '',
        category: 'General',
        total_members: 1,
        rsvp_status: 'Pending',
      });

      // Refresh guest list
      fetchGuests();
    } catch (err) {
      console.error('Add guest error:', err);
      setError(err.response?.data?.message || 'Database error adding guest');
    }
  };

  const handleStatusChange = async (guestId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/guests/${guestId}`, { rsvp_status: newStatus });
      fetchGuests();
    } catch (err) {
      alert('Failed to update RSVP status');
    }
  };

  const handleDeleteGuest = async (guestId) => {
    if (!window.confirm('Are you sure you want to remove this guest?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/guests/${guestId}`);
      fetchGuests();
    } catch (err) {
      alert('Failed to delete guest');
    }
  };

  // Quick stats calculations
  const totalGuests = guests.length;
  const totalHeadcount = guests.reduce((sum, g) => sum + (parseInt(g.total_members) || 1), 0);
  const acceptedRSVP = guests.filter((g) => g.rsvp_status === 'Accepted').length;
  const pendingRSVP = guests.filter((g) => g.rsvp_status === 'Pending').length;

  if (!activeClientId) {
    return (
      <div style={{ textAlign: 'center', marginTop: '60px', fontFamily: 'sans-serif', color: '#64748b' }}>
        <h2>⚠️ No Client Selected</h2>
        <p>Please select an active wedding client from the dropdown menu in the top navigation bar.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '20px auto', fontFamily: 'sans-serif', padding: '0 16px' }}>
      <h2 style={{ color: '#1e293b', marginBottom: '8px' }}>👥 Guest List Management</h2>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>
        Managing guests for active client ID: <strong>#{activeClientId}</strong>
      </p>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>TOTAL GUEST ENTRIES</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>{totalGuests}</div>
        </div>
        <div style={{ backgroundColor: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#0369a1', fontWeight: 'bold' }}>TOTAL HEADCOUNT</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0284c7' }}>{totalHeadcount}</div>
        </div>
        <div style={{ backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#15803d', fontWeight: 'bold' }}>ACCEPTED (RSVP)</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>{acceptedRSVP}</div>
        </div>
        <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', color: '#b45309', fontWeight: 'bold' }}>PENDING (RSVP)</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>{pendingRSVP}</div>
        </div>
      </div>

      {/* Notifications */}
      {error && <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>❌ {error}</div>}
      {successMessage && <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>✅ {successMessage}</div>}

      {/* Add Guest Form */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#334155' }}>➕ Add New Guest</h3>
        <form onSubmit={handleAddGuest} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Guest Name *</label>
            <input type="text" name="guest_name" value={formData.guest_name} onChange={handleChange} placeholder="e.g. Ramesh Sharma" required style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Contact Number</label>
            <input type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="+91 9876543210" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Category</label>
            <select name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <option value="General">General</option>
              <option value="Family">Family</option>
              <option value="VIP">VIP</option>
              <option value="Bride Side">Bride Side</option>
              <option value="Groom Side">Groom Side</option>
              <option value="Friends">Friends</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Total Members</label>
            <input type="number" name="total_members" min="1" value={formData.total_members} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>RSVP Status</label>
            <select name="rsvp_status" value={formData.rsvp_status} onChange={handleChange} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Declined">Declined</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '8px' }}>
            <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>
              Save Guest
            </button>
          </div>
        </form>
      </div>

      {/* Guest Table */}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '12px' }}>Name</th>
              <th style={{ padding: '12px' }}>Contact</th>
              <th style={{ padding: '12px' }}>Category</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Members</th>
              <th style={{ padding: '12px' }}>RSVP Status</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center' }}>Loading guests...</td></tr>
            ) : guests.length === 0 ? (
              <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>No guests found for this client. Add one above!</td></tr>
            ) : (
              guests.map((g) => (
                <tr key={g.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#1e293b' }}>{g.guest_name}</td>
                  <td style={{ padding: '12px', color: '#64748b' }}>{g.contact || 'N/A'}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 'bold' }}>
                      {g.category}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>{g.total_members}</td>
                  <td style={{ padding: '12px' }}>
                    <select
                      value={g.rsvp_status}
                      onChange={(e) => handleStatusChange(g.id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontWeight: 'bold',
                        backgroundColor: g.rsvp_status === 'Accepted' ? '#dcfce7' : g.rsvp_status === 'Declined' ? '#fee2e2' : '#fef3c7',
                        color: g.rsvp_status === 'Accepted' ? '#166534' : g.rsvp_status === 'Declined' ? '#991b1b' : '#92400e',
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleDeleteGuest(g.id)}
                      style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Guests;