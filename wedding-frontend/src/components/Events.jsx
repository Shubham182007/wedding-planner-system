import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Events() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);

  const [formData, setFormData] = useState({
    event_type: 'Haldi',
    event_date: '',
    event_time: '',
    location: '',
    description: '',
  });

  const [message, setMessage] = useState('');

  // Normal user login information
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Admin login information
  const isAdminAuthenticated =
    localStorage.getItem('isAdminAuthenticated') === 'true';

  // When admin clicks "Manage Wedding", selectedClientId is saved.
  // For a normal user, use their own user ID.
  const activeClientId =
    localStorage.getItem('selectedClientId') || user?.id;

  const fetchEvents = async () => {
    if (!activeClientId) return;

    try {
      const res = await axios.get(
        `https://wedding-planner-backend-zjgi.onrender.com/api/events/${activeClientId}`
      );

      setEvents(res.data);
    } catch (err) {
      console.error('Failed to load events:', err);
      setMessage('Failed to load events.');
    }
  };

  useEffect(() => {
    // Redirect only when nobody is logged in.
    if (!user && !isAdminAuthenticated) {
      navigate('/login');
      return;
    }

    // If a wedding/client exists, load its events.
    if (activeClientId) {
      fetchEvents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!activeClientId) {
      setMessage(
        '⚠️ No wedding selected. Please go to Dashboard and click Manage Wedding.'
      );
      return;
    }

    try {
      await axios.post(
        'https://wedding-planner-backend-zjgi.onrender.com/api/events',
        {
          ...formData,
          user_id: activeClientId,
        }
      );

      setMessage('🎉 Event created successfully!');

      setFormData({
        event_type: 'Haldi',
        event_date: '',
        event_time: '',
        location: '',
        description: '',
      });

      fetchEvents();

      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error creating event:', err);

      setMessage(
        err.response?.data?.message || 'Error creating event.'
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this event?'
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `https://wedding-planner-backend-zjgi.onrender.com/api/events/${id}`
      );

      fetchEvents();
    } catch (err) {
      console.error('Failed to delete event:', err);
      setMessage('Failed to delete event.');
    }
  };

  // Logged in, but admin has not selected a wedding yet.
  if (!activeClientId) {
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        <h2>⚠️ No Wedding Selected</h2>

        <p>
          Please go to the Dashboard and click
          <strong> Manage Wedding </strong>
          first.
        </p>

        <button
          className="btn btn-primary"
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>🎉 Manage Wedding Events</h2>

          <small className="text-muted">
            Managing wedding ID: #{activeClientId}
          </small>
        </div>

        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>

      {message && (
        <div className="alert alert-info">
          {message}
        </div>
      )}

      <div className="row">

        {/* EVENT FORM */}
        <div className="col-md-5 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">

              <h4 className="card-title mb-3">
                Add New Event
              </h4>

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Event Type
                  </label>

                  <select
                    className="form-select"
                    value={formData.event_type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        event_type: e.target.value,
                      })
                    }
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
                  <label className="form-label fw-bold">
                    Date
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    required
                    value={formData.event_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        event_date: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Time
                  </label>

                  <input
                    type="time"
                    className="form-control"
                    required
                    value={formData.event_time}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        event_time: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Location / Venue
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Royal Palace Hall, Mumbai"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Description / Notes
                  </label>

                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Theme, dress code, or event details..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                >
                  Add Event
                </button>

              </form>
            </div>
          </div>
        </div>

        {/* EVENT LIST */}
        <div className="col-md-7">

          <h4 className="mb-3">
            Scheduled Events ({events.length})
          </h4>

          {events.length === 0 ? (
            <div className="alert alert-light text-center border">
              No events added yet. Fill out the form to schedule
              your first event!
            </div>
          ) : (
            <div className="row g-3">

              {events.map((evt) => (
                <div
                  key={evt.id}
                  className="col-12"
                >
                  <div className="card border-0 shadow-sm border-start border-4 border-primary">

                    <div className="card-body">

                      <div className="d-flex justify-content-between align-items-start">

                        <h5 className="card-title text-primary fw-bold">
                          {evt.event_type}
                        </h5>

                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(evt.id)}
                        >
                          Delete
                        </button>

                      </div>

                      <p className="card-text mb-1">
                        📅 <strong>Date:</strong>{' '}
                        {new Date(
                          evt.event_date
                        ).toLocaleDateString()}
                      </p>

                      <p className="card-text mb-1">
                        ⏰ <strong>Time:</strong>{' '}
                        {evt.event_time}
                      </p>

                      <p className="card-text mb-1">
                        📍 <strong>Location:</strong>{' '}
                        {evt.location}
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