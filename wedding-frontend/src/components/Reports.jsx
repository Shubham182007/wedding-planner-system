import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Reports() {
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const activeClientId = localStorage.getItem('selectedClientId') || user?.id;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchSummary();
    }
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reports/summary/${activeClientId}`);
      setSummary(res.data);
    } catch (err) {
      console.error('Error fetching report analytics:', err);
    }
  };

  if (!summary) {
    return <div className="text-center my-5">Loading report summary...</div>;
  }

  const { guests, budget, vendors, events, seated_guests } = summary;

  const totalBudget = Number(budget.target_budget) || 0;
  const actualSpent = Number(budget.total_actual) || 0;
  const remainingBudget = totalBudget - actualSpent;
  const budgetUtilization = totalBudget > 0 ? Math.min(Math.round((actualSpent / totalBudget) * 100), 100) : 0;

  const rsvpAccepted = Number(guests.attending) || 0;
  const totalGuests = Number(guests.total_guests) || 0;
  const rsvpRate = totalGuests > 0 ? Math.round((rsvpAccepted / totalGuests) * 100) : 0;

  return (
    <div className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>📊 Reports & Analytics Summary</h2>
          <p className="text-muted mb-0">High-level metrics across guests, RSVPs, budget, vendors, and seating.</p>
        </div>
        <div>
          <button className="btn btn-outline-primary btn-sm me-2" onClick={() => window.print()}>
            🖨️ Print Report
          </button>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Top High-Level Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-primary text-white p-3 text-center">
            <h6>Total Invited Guests</h6>
            <h2 className="fw-bold">{guests.total_guests || 0}</h2>
            <small>{guests.total_headcount || 0} Total Headcount</small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-success text-white p-3 text-center">
            <h6>RSVP Acceptance Rate</h6>
            <h2 className="fw-bold">{rsvpRate}%</h2>
            <small>{rsvpAccepted} Guests Confirmed</small>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-dark text-white p-3 text-center">
            <h6>Target Budget</h6>
            <h2 className="fw-bold">₹{totalBudget.toLocaleString()}</h2>
            <small>Spent: ₹{actualSpent.toLocaleString()}</small>
          </div>
        </div>

        <div className="col-md-3">
          <div className={`card border-0 shadow-sm text-white p-3 text-center ${remainingBudget >= 0 ? 'bg-info' : 'bg-danger'}`}>
            <h6>Remaining Balance</h6>
            <h2 className="fw-bold">₹{remainingBudget.toLocaleString()}</h2>
            <small>{remainingBudget >= 0 ? 'Within Target' : 'Over Budget'}</small>
          </div>
        </div>
      </div>

      {/* Detailed Module Reports Grid */}
      <div className="row g-4">
        
        {/* 1. Guests & RSVP Analytics */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3 border-bottom pb-2">👥 Guest & RSVP Report</h5>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>RSVP Responses Progress</span>
                  <span>{rsvpAccepted} / {totalGuests} Confirmed</span>
                </div>
                <div className="progress" style={{ height: '18px' }}>
                  <div className="progress-bar bg-success" style={{ width: `${rsvpRate}%` }}>
                    {rsvpRate}%
                  </div>
                </div>
              </div>

              <table className="table table-sm mt-3">
                <tbody>
                  <tr>
                    <td>Attending (Accepted)</td>
                    <td className="fw-bold text-success text-end">{guests.attending || 0}</td>
                  </tr>
                  <tr>
                    <td>Pending Response</td>
                    <td className="fw-bold text-warning text-end">{guests.pending_rsvp || 0}</td>
                  </tr>
                  <tr>
                    <td>Declined</td>
                    <td className="fw-bold text-danger text-end">{guests.declined || 0}</td>
                  </tr>
                  <tr>
                    <td>Seated Guests</td>
                    <td className="fw-bold text-primary text-end">{seated_guests} / {totalGuests}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 2. Budget & Expense Analytics */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3 border-bottom pb-2">💰 Financial Expense Report</h5>

              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Budget Spent Utilization</span>
                  <span>{budgetUtilization}% Spent</span>
                </div>
                <div className="progress" style={{ height: '18px' }}>
                  <div 
                    className={`progress-bar ${budgetUtilization > 90 ? 'bg-danger' : 'bg-primary'}`} 
                    style={{ width: `${budgetUtilization}%` }}
                  >
                    {budgetUtilization}%
                  </div>
                </div>
              </div>

              <table className="table table-sm mt-3">
                <tbody>
                  <tr>
                    <td>Target Budget</td>
                    <td className="fw-bold text-end">₹{totalBudget.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Total Planned Expenses</td>
                    <td className="fw-bold text-info text-end">₹{(Number(budget.total_planned) || 0).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Actual Spent Amount</td>
                    <td className="fw-bold text-dark text-end">₹{actualSpent.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Remaining Budget Balance</td>
                    <td className={`fw-bold text-end ${remainingBudget >= 0 ? 'text-success' : 'text-danger'}`}>
                      ₹{remainingBudget.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 3. Vendor Status Report */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3 border-bottom pb-2">🤝 Vendor Management Report</h5>
              <table className="table table-sm">
                <tbody>
                  <tr>
                    <td>Total Hired Vendors</td>
                    <td className="fw-bold text-end">{vendors.total_vendors || 0}</td>
                  </tr>
                  <tr>
                    <td>Confirmed Bookings</td>
                    <td className="fw-bold text-success text-end">{vendors.confirmed_vendors || 0}</td>
                  </tr>
                  <tr>
                    <td>Total Agreed Vendor Charges</td>
                    <td className="fw-bold text-end">₹{(Number(vendors.total_vendor_cost) || 0).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Advance Payments Made</td>
                    <td className="fw-bold text-success text-end">₹{(Number(vendors.vendor_paid) || 0).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td>Pending Vendor Payments</td>
                    <td className="fw-bold text-danger text-end">
                      ₹{((Number(vendors.total_vendor_cost) || 0) - (Number(vendors.vendor_paid) || 0)).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 4. Event Overview Report */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3 border-bottom pb-2">🎉 Events & Logistics Report</h5>
              <table className="table table-sm">
                <tbody>
                  <tr>
                    <td>Total Planned Events</td>
                    <td className="fw-bold text-end">{events} Events</td>
                  </tr>
                  <tr>
                    <td>Seating Arrangement Status</td>
                    <td className="fw-bold text-end">{seated_guests} Guests Assigned Seats</td>
                  </tr>
                  <tr>
                    <td>Unassigned Seating Status</td>
                    <td className="fw-bold text-warning text-end">
                      {Math.max(0, totalGuests - seated_guests)} Guests Unseated
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}