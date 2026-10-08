import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Seating() {
  const [tables, setTables] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [guests, setGuests] = useState([]);
  const [tableName, setTableName] = useState('');
  const [capacity, setCapacity] = useState(8);
  const [selectedGuest, setSelectedGuest] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  // Normal user login
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Admin login
  const isAdminAuthenticated =
    localStorage.getItem('isAdminAuthenticated') === 'true';

  // Admin uses selected wedding ID.
  // Normal user uses their own user ID.
  const activeClientId =
    localStorage.getItem('selectedClientId') || user?.id;

  const fetchSeatingData = async () => {
    if (!activeClientId) return;

    try {
      const res = await axios.get(
        `https://wedding-planner-backend-zjgi.onrender.com/api/seating/tables/${activeClientId}`
      );

      setTables(res.data.tables || []);
      setAssignments(res.data.assignments || []);
    } catch (err) {
      console.error('Error loading seating data:', err);
      setMessage('Failed to load seating data.');
    }
  };

  const fetchGuests = async () => {
    if (!activeClientId) return;

    try {
      const res = await axios.get(
        `https://wedding-planner-backend-zjgi.onrender.com/api/guests/${activeClientId}`
      );

      setGuests(res.data || []);
    } catch (err) {
      console.error('Error fetching guests:', err);
      setMessage('Failed to load guests.');
    }
  };

  useEffect(() => {
    // Redirect only when neither normal user nor admin is logged in
    if (!user && !isAdminAuthenticated) {
      navigate('/login');
      return;
    }

    // Load data only if a wedding is selected
    if (activeClientId) {
      fetchSeatingData();
      fetchGuests();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateTable = async (e) => {
    e.preventDefault();

    if (!activeClientId) {
      setMessage(
        '⚠️ No wedding selected. Please go to Dashboard and click Manage Wedding.'
      );
      return;
    }

    try {
      await axios.post(
        'https://wedding-planner-backend-zjgi.onrender.com/api/seating/tables',
        {
          user_id: activeClientId,
          table_name: tableName,
          capacity: capacity
        }
      );

      setTableName('');
      setCapacity(8);
      setMessage('✅ Table created successfully!');

      fetchSeatingData();

      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error creating table:', err);
      setMessage(
        err.response?.data?.message || 'Error creating table.'
      );
    }
  };

  const handleDeleteTable = async (id) => {
    const confirmed = window.confirm(
      'Are you sure? This will remove all guest assignments for this table.'
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `https://wedding-planner-backend-zjgi.onrender.com/api/seating/tables/${id}`
      );

      fetchSeatingData();
    } catch (err) {
      console.error('Error deleting table:', err);
      setMessage('Failed to delete table.');
    }
  };

  const handleAssignGuest = async (e) => {
    e.preventDefault();

    if (!selectedGuest || !selectedTable) {
      return;
    }

    if (!activeClientId) {
      setMessage('⚠️ No wedding selected.');
      return;
    }

    try {
      await axios.post(
        'https://wedding-planner-backend-zjgi.onrender.com/api/seating/assign',
        {
          user_id: activeClientId,
          table_id: selectedTable,
          guest_id: selectedGuest
        }
      );

      setSelectedGuest('');
      setSelectedTable('');
      setMessage('🎉 Guest assigned to table!');

      fetchSeatingData();

      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      console.error('Failed to assign guest:', err);

      setMessage(
        err.response?.data?.message || 'Failed to assign guest.'
      );
    }
  };

  const handleUnassignGuest = async (assignmentId) => {
    try {
      await axios.delete(
        `https://wedding-planner-backend-zjgi.onrender.com/api/seating/unassign/${assignmentId}`
      );

      fetchSeatingData();
    } catch (err) {
      console.error('Failed to unassign guest:', err);
      setMessage('Failed to unassign guest.');
    }
  };

  const assignedGuestIds = assignments.map((a) =>
    Number(a.guest_id)
  );

  const unassignedGuests = guests.filter(
    (g) => !assignedGuestIds.includes(Number(g.id))
  );

  // Admin/user is logged in, but no wedding selected
  if (!activeClientId) {
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: '60px',
          fontFamily: 'sans-serif'
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
    <div className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h2>🪑 Seating Arrangement</h2>

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

      <div className="row g-4 mb-4">

        {/* Create Table */}
        <div className="col-md-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">

              <h5 className="fw-bold mb-3">
                ➕ Add New Table
              </h5>

              <form onSubmit={handleCreateTable}>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Table Name / Number
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. VIP Table 1, Family Table A"
                    value={tableName}
                    onChange={(e) =>
                      setTableName(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Seating Capacity
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="50"
                    className="form-control"
                    value={capacity}
                    onChange={(e) =>
                      setCapacity(e.target.value)
                    }
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold"
                >
                  Create Table
                </button>

              </form>
            </div>
          </div>
        </div>

        {/* Assign Guest */}
        <div className="col-md-7">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">

              <h5 className="fw-bold mb-3">
                🎯 Assign Guest to Table
              </h5>

              <form
                onSubmit={handleAssignGuest}
                className="row g-2"
              >

                <div className="col-md-6">
                  <label className="form-label fw-bold">
                    Select Unassigned Guest
                  </label>

                  <select
                    className="form-select"
                    value={selectedGuest}
                    onChange={(e) =>
                      setSelectedGuest(e.target.value)
                    }
                    required
                  >
                    <option value="">
                      Choose Guest...
                    </option>

                    {unassignedGuests.map((g) => (
                      <option
                        key={g.id}
                        value={g.id}
                      >
                        {g.guest_name} ({g.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">
                    Select Target Table
                  </label>

                  <select
                    className="form-select"
                    value={selectedTable}
                    onChange={(e) =>
                      setSelectedTable(e.target.value)
                    }
                    required
                  >
                    <option value="">
                      Choose Table...
                    </option>

                    {tables.map((t) => {
                      const count = assignments.filter(
                        (a) =>
                          Number(a.table_id) === Number(t.id)
                      ).length;

                      return (
                        <option
                          key={t.id}
                          value={t.id}
                          disabled={count >= Number(t.capacity)}
                        >
                          {t.table_name} ({count}/{t.capacity} seats taken)
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="col-12 mt-3">
                  <button
                    type="submit"
                    className="btn btn-success w-100 fw-bold"
                  >
                    Assign Guest
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Table Layout */}
      <h4 className="fw-bold mb-3">
        📋 Table Layout & Assignments
      </h4>

      {tables.length === 0 ? (
        <div className="alert alert-light text-center py-4 border">
          No seating tables created yet. Add a table above
          to start organizing.
        </div>
      ) : (
        <div className="row g-4">

          {tables.map((t) => {
            const tableGuests = assignments.filter(
              (a) =>
                Number(a.table_id) === Number(t.id)
            );

            const isFull =
              tableGuests.length >= Number(t.capacity);

            return (
              <div
                key={t.id}
                className="col-md-6 col-lg-4"
              >
                <div className="card shadow-sm border-0 h-100">

                  <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">

                    <div>
                      <h6 className="fw-bold mb-0">
                        {t.table_name}
                      </h6>

                      <small className="text-muted">
                        Capacity: {t.capacity} seats
                      </small>
                    </div>

                    <span
                      className={`badge ${
                        isFull
                          ? 'bg-danger'
                          : 'bg-primary'
                      }`}
                    >
                      {tableGuests.length} / {t.capacity} Seated
                    </span>

                  </div>

                  <div className="card-body p-3">

                    {tableGuests.length === 0 ? (
                      <p className="text-muted text-center my-3 small">
                        No guests assigned to this table yet.
                      </p>
                    ) : (
                      <ul className="list-group list-group-flush">

                        {tableGuests.map((g) => (
                          <li
                            key={g.assignment_id}
                            className="list-group-item d-flex justify-content-between align-items-center px-0 py-2"
                          >

                            <div>
                              <span className="fw-bold small">
                                {g.guest_name}
                              </span>

                              <br />

                              <span className="badge bg-light text-dark border me-1">
                                {g.category}
                              </span>
                            </div>

                            <button
                              className="btn btn-outline-danger btn-xs py-0 px-2"
                              onClick={() =>
                                handleUnassignGuest(
                                  g.assignment_id
                                )
                              }
                              title="Unassign Guest"
                            >
                              ✕
                            </button>

                          </li>
                        ))}

                      </ul>
                    )}

                  </div>

                  <div className="card-footer bg-light border-0 text-end">

                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() =>
                        handleDeleteTable(t.id)
                      }
                    >
                      Delete Table
                    </button>

                  </div>

                </div>
              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}