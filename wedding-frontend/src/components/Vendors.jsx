import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    vendor_name: '',
    category: 'Caterer',
    contact: '',
    price: '',
    paid_amount: '',
    booking_status: 'Pending'
  });

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

  const fetchVendors = async () => {
    if (!activeClientId) return;

    try {
      const res = await axios.get(
        `https://wedding-planner-backend-zjgi.onrender.com/api/vendors/${activeClientId}`
      );

      setVendors(res.data);
    } catch (err) {
      console.error('Failed to load vendors:', err);
      setMessage('Failed to load vendors.');
    }
  };

  useEffect(() => {
    // Redirect only if neither normal user nor admin is logged in
    if (!user && !isAdminAuthenticated) {
      navigate('/login');
      return;
    }

    // Load vendors only when a wedding/client is selected
    if (activeClientId) {
      fetchVendors();
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
      if (editingId) {
        await axios.put(
          `https://wedding-planner-backend-zjgi.onrender.com/api/vendors/${editingId}`,
          formData
        );

        setMessage('✅ Vendor updated successfully!');
      } else {
        await axios.post(
          'https://wedding-planner-backend-zjgi.onrender.com/api/vendors',
          {
            ...formData,
            user_id: activeClientId
          }
        );

        setMessage('🎉 Vendor added successfully!');
      }

      resetForm();
      fetchVendors();

      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      console.error('Vendor save error:', err);

      setMessage(
        err.response?.data?.message ||
          'Error saving vendor details.'
      );
    }
  };

  const handleEdit = (vendor) => {
    setEditingId(vendor.id);

    setFormData({
      vendor_name: vendor.vendor_name,
      category: vendor.category,
      contact: vendor.contact || '',
      price: vendor.price,
      paid_amount: vendor.paid_amount,
      booking_status: vendor.booking_status
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this vendor?'
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `https://wedding-planner-backend-zjgi.onrender.com/api/vendors/${id}`
      );

      fetchVendors();
    } catch (err) {
      console.error('Failed to delete vendor:', err);
      setMessage('Failed to delete vendor.');
    }
  };

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      vendor_name: '',
      category: 'Caterer',
      contact: '',
      price: '',
      paid_amount: '',
      booking_status: 'Pending'
    });
  };

  // Search and filter
  const filteredVendors = vendors.filter((v) => {
    const vendorName = (v.vendor_name || '').toLowerCase();
    const vendorContact = (v.contact || '').toLowerCase();
    const searchText = search.toLowerCase();

    const matchesSearch =
      vendorName.includes(searchText) ||
      vendorContact.includes(searchText);

    const matchesCategory =
      categoryFilter === 'All' ||
      v.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Financial calculations
  const totalPrice = vendors.reduce(
    (sum, v) => sum + Number(v.price || 0),
    0
  );

  const totalPaid = vendors.reduce(
    (sum, v) => sum + Number(v.paid_amount || 0),
    0
  );

  const totalDue = totalPrice - totalPaid;

  // Logged in but no wedding selected
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
          <h2>🤝 Vendor Management</h2>

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

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card text-center border-0 shadow-sm bg-primary text-white p-3">
            <h6>Total Vendors</h6>
            <h3>{vendors.length}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center border-0 shadow-sm bg-dark text-white p-3">
            <h6>Total Agreed Cost</h6>
            <h3>₹{totalPrice.toLocaleString()}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center border-0 shadow-sm bg-success text-white p-3">
            <h6>Advance Paid</h6>
            <h3>₹{totalPaid.toLocaleString()}</h3>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center border-0 shadow-sm bg-danger text-white p-3">
            <h6>Pending Balance</h6>
            <h3>₹{totalDue.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {message && (
        <div className="alert alert-info">
          {message}
        </div>
      )}

      <div className="row">

        {/* Form Column */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">

              <h4 className="card-title mb-3">
                {editingId ? 'Edit Vendor' : 'Add New Vendor'}
              </h4>

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Vendor / Company Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    required
                    value={formData.vendor_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        vendor_name: e.target.value
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Category
                  </label>

                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value
                      })
                    }
                  >
                    <option value="Caterer">Caterer</option>
                    <option value="Photographer">Photographer</option>
                    <option value="Decorator">Decorator</option>
                    <option value="Makeup Artist">Makeup Artist</option>
                    <option value="DJ">DJ</option>
                    <option value="Florist">Florist</option>
                    <option value="Venue">Venue</option>
                    <option value="Transport Provider">
                      Transport Provider
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Contact Number / Details
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. +91 9876543210"
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contact: e.target.value
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Total Agreed Price (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: e.target.value
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Amount Paid (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="0.00"
                    value={formData.paid_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paid_amount: e.target.value
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Booking Status
                  </label>

                  <select
                    className="form-select"
                    value={formData.booking_status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        booking_status: e.target.value
                      })
                    }
                  >
                    <option value="Pending">Pending ⏳</option>
                    <option value="Confirmed">Confirmed ✅</option>
                    <option value="Cancelled">Cancelled ❌</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold"
                >
                  {editingId ? 'Update Vendor' : 'Add Vendor'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="btn btn-secondary w-100 mt-2"
                    onClick={resetForm}
                  >
                    Cancel Edit
                  </button>
                )}

              </form>
            </div>
          </div>
        </div>

        {/* Vendor List */}
        <div className="col-md-8">

          <div className="card shadow-sm border-0 p-3 mb-3">
            <div className="row g-2">

              <div className="col-md-7">
                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Search vendor by name or contact..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />
              </div>

              <div className="col-md-5">
                <select
                  className="form-select"
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(e.target.value)
                  }
                >
                  <option value="All">
                    Filter Category (All)
                  </option>
                  <option value="Caterer">Caterer</option>
                  <option value="Photographer">Photographer</option>
                  <option value="Decorator">Decorator</option>
                  <option value="Makeup Artist">Makeup Artist</option>
                  <option value="DJ">DJ</option>
                  <option value="Florist">Florist</option>
                  <option value="Venue">Venue</option>
                  <option value="Transport Provider">
                    Transport Provider
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

            </div>
          </div>

          <div className="card shadow-sm border-0">
            <div className="card-body p-0">

              <div className="table-responsive">

                <table className="table table-hover align-middle mb-0">

                  <thead className="table-light">
                    <tr>
                      <th>Vendor</th>
                      <th>Category</th>
                      <th>Contact</th>
                      <th>Price</th>
                      <th>Paid / Due</th>
                      <th>Status</th>
                      <th className="text-end">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredVendors.length === 0 ? (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-4 text-muted"
                        >
                          No matching vendors found.
                        </td>
                      </tr>
                    ) : (
                      filteredVendors.map((v) => {

                        const due =
                          Number(v.price || 0) -
                          Number(v.paid_amount || 0);

                        return (
                          <tr key={v.id}>

                            <td className="fw-bold">
                              {v.vendor_name}
                            </td>

                            <td>
                              <span className="badge bg-info text-dark">
                                {v.category}
                              </span>
                            </td>

                            <td>
                              {v.contact || 'N/A'}
                            </td>

                            <td>
                              ₹{Number(v.price || 0).toLocaleString()}
                            </td>

                            <td>
                              <small className="text-success fw-bold">
                                ₹{Number(
                                  v.paid_amount || 0
                                ).toLocaleString()}
                              </small>

                              <br />

                              <small className="text-danger">
                                Due: ₹{due.toLocaleString()}
                              </small>
                            </td>

                            <td>
                              {v.booking_status === 'Confirmed' && (
                                <span className="badge bg-success">
                                  Confirmed
                                </span>
                              )}

                              {v.booking_status === 'Pending' && (
                                <span className="badge bg-warning text-dark">
                                  Pending
                                </span>
                              )}

                              {v.booking_status === 'Cancelled' && (
                                <span className="badge bg-danger">
                                  Cancelled
                                </span>
                              )}
                            </td>

                            <td className="text-end">

                              <button
                                className="btn btn-outline-primary btn-sm me-2"
                                onClick={() => handleEdit(v)}
                              >
                                Edit
                              </button>

                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => handleDelete(v.id)}
                              >
                                Delete
                              </button>

                            </td>

                          </tr>
                        );
                      })
                    )}

                  </tbody>
                </table>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}