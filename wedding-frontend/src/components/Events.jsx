import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    event_type: 'Haldi',
    event_date: '',
    event_time: '',
    location: '',
    description: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const activeClientId = localStorage.getItem('selectedClientId') || user?.id;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchEvents();
    }
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/events/${activeClientId}`);
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to load events:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/events', {
        ...formData,
        user_id: activeClientId
      });
      setMessage('🎉 Event created successfully!');
      setFormData({ event_type: 'Haldi', event_date: '', event_time: '', location: '', description: '' });
      fetchEvents();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error creating event.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${id}`);
        fetchEvents();
      } catch (err) {
        console.error('Failed to delete event:', err);
      }
    }
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🎉 Manage Wedding Events</h2>
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="row">
        {/* Event Form */}
        <div className="col-md-5 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h4 className="card-title mb-3">Add New Event</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Event Type</label>
                  <select 
                    className="form-select" 
                    value={formData.event_type}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                  >
                    <option value="Engagement">Engagement</option>
                    <option value="Haldi">Haldi</option>
                    <option value="Mehendi">Mehendi</option>
                    <option value="Sangeet">Sangeet</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Reception">Reception</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    required 
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })} 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Time</label>
                  <input 
                    type="time" 
                    className="form-control" 
                    required 
                    value={formData.event_time}
                    onChange={(e) => setFormData({ ...formData, event_time: e.target.value })} 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Location / Venue</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Royal Palace Hall, Mumbai" 
                    required 
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })} 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Description / Notes</label>
                  <textarea 
                    className="form-control" 
                    rows="2" 
                    placeholder="Theme, dress code, or event details..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary w-100">Add Event</button>
              </form>
            </div>
          </div>
        </div>

        {/* Event List Display */}
        <div className="col-md-7">
          <h4 className="mb-3">Scheduled Events ({events.length})</h4>
          {events.length === 0 ? (
            <div className="alert alert-light text-center border">
              No events added yet. Fill out the form to schedule your first event!
            </div>
          ) : (
            <div className="row g-3">
              {events.map((evt) => (
                <div key={evt.id} className="col-12">
                  <div className="card border-0 shadow-sm border-start border-4 border-primary">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="card-title text-primary fw-bold">{evt.event_type}</h5>
                        <button 
                          className="btn btn-outline-danger btn-sm" 
                          onClick={() => handleDelete(evt.id)}
                        >
                          Delete
                        </button>
                      </div>
                      <p className="card-text mb-1">
                        📅 <strong>Date:</strong> {new Date(evt.event_date).toLocaleDateString()}
                      </p>
                      <p className="card-text mb-1">
                        ⏰ <strong>Time:</strong> {evt.event_time}
                      </p>
                      <p className="card-text mb-1">
                        📍 <strong>Location:</strong> {evt.location}
                      </p>
                      {evt.description && (
                        <p className="card-text text-muted small mt-2">
                          📝 {evt.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}