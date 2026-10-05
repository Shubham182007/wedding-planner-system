import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClientSelector = ({ onSelectClient }) => {
  const [clients, setClients] = useState([]);
  const [selectedId, setSelectedId] = useState(localStorage.getItem('selectedClientId') || '');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/client-weddings');
      setClients(res.data);

      // Auto-select first client if none selected
      if (!localStorage.getItem('selectedClientId') && res.data.length > 0) {
        handleSelect(res.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching client list:', err);
    }
  };

  const handleSelect = (clientId) => {
    setSelectedId(clientId);
    localStorage.setItem('selectedClientId', clientId);
    if (onSelectClient) {
      onSelectClient(clientId);
    }
  };

  return (
    <div style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <label style={{ fontWeight: 'bold', fontSize: '14px', color: '#334155' }}>Active Client Wedding:</label>
      <select 
        value={selectedId} 
        onChange={(e) => handleSelect(e.target.value)}
        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: '600' }}
      >
        <option value="">-- Select a Wedding --</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.couple_name} ({client.event_date ? new Date(client.event_date).toLocaleDateString() : 'Date TBD'})
          </option>
        ))}
      </select>
    </div>
  );
};

export default ClientSelector;