import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Budget() {
  const [totalBudget, setTotalBudget] = useState(0);
  const [inputBudget, setInputBudget] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Venue',
    planned_amount: '',
    actual_amount: ''
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

  const fetchBudgetData = async () => {
    if (!activeClientId) return;

    try {
      const res = await axios.get(
        `https://wedding-planner-backend-zjgi.onrender.com/api/budget/${activeClientId}`
      );

      setTotalBudget(Number(res.data.total_budget) || 0);
      setInputBudget(res.data.total_budget || '');
      setExpenses(res.data.expenses || []);
    } catch (err) {
      console.error('Failed to load budget data:', err);
      setMessage('Failed to load budget data.');
    }
  };

  useEffect(() => {
    // Redirect only if neither normal user nor admin is logged in
    if (!user && !isAdminAuthenticated) {
      navigate('/login');
      return;
    }

    if (activeClientId) {
      fetchBudgetData();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetTargetBudget = async (e) => {
    e.preventDefault();

    if (!activeClientId) {
      setMessage(
        '⚠️ No wedding selected. Please go to Dashboard and click Manage Wedding.'
      );
      return;
    }

    try {
      await axios.post(
        'https://wedding-planner-backend-zjgi.onrender.com/api/budget/set-target',
        {
          user_id: activeClientId,
          total_budget: inputBudget
        }
      );

      setTotalBudget(Number(inputBudget) || 0);

      setMessage('✅ Target budget updated successfully!');

      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error setting budget target:', err);

      setMessage(
        err.response?.data?.message ||
          'Error setting budget target.'
      );
    }
  };

  const handleSubmitExpense = async (e) => {
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
          `https://wedding-planner-backend-zjgi.onrender.com/api/expenses/${editingId}`,
          formData
        );

        setMessage('✅ Expense updated successfully!');
      } else {
        await axios.post(
          'https://wedding-planner-backend-zjgi.onrender.com/api/expenses',
          {
            ...formData,
            user_id: activeClientId
          }
        );

        setMessage('🎉 Expense added successfully!');
      }

      resetForm();
      fetchBudgetData();

      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error saving expense:', err);

      setMessage(
        err.response?.data?.message ||
          'Error saving expense item.'
      );
    }
  };

  const handleEdit = (exp) => {
    setEditingId(exp.id);

    setFormData({
      title: exp.title || '',
      category: exp.category || 'Venue',
      planned_amount: exp.planned_amount || '',
      actual_amount: exp.actual_amount || ''
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this expense record?'
    );

    if (!confirmed) return;

    try {
      await axios.delete(
        `https://wedding-planner-backend-zjgi.onrender.com/api/expenses/${id}`
      );

      fetchBudgetData();
    } catch (err) {
      console.error('Failed to delete expense:', err);
      setMessage('Failed to delete expense.');
    }
  };

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      title: '',
      category: 'Venue',
      planned_amount: '',
      actual_amount: ''
    });
  };

  // Financial calculations
  const totalPlanned = expenses.reduce(
    (sum, e) => sum + Number(e.planned_amount || 0),
    0
  );

  const totalActual = expenses.reduce(
    (sum, e) => sum + Number(e.actual_amount || 0),
    0
  );

  const remainingBudget = totalBudget - totalActual;

  const budgetProgress =
    totalBudget > 0
      ? Math.min(
          Math.round((totalActual / totalBudget) * 100),
          100
        )
      : 0;

  // Search and filtering
  const filteredExpenses = expenses.filter((e) => {
    const expenseTitle = (e.title || '').toLowerCase();
    const searchText = search.toLowerCase();

    const matchesSearch =
      expenseTitle.includes(searchText);

    const matchesCategory =
      categoryFilter === 'All' ||
      e.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Logged in, but no wedding selected
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
          <h2>💰 Budget & Expense Management</h2>

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

      {/* TARGET BUDGET */}
      <div className="card shadow-sm border-0 mb-4 p-4">

        <div className="row align-items-center">

          <div className="col-md-5 border-end">

            <h5 className="fw-bold mb-3">
              🎯 Set Overall Target Budget
            </h5>

            <form
              onSubmit={handleSetTargetBudget}
              className="d-flex gap-2"
            >

              <div className="input-group">

                <span className="input-group-text">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  className="form-control"
                  placeholder="Enter target budget..."
                  value={inputBudget}
                  onChange={(e) =>
                    setInputBudget(e.target.value)
                  }
                  required
                />

              </div>

              <button
                type="submit"
                className="btn btn-primary fw-bold text-nowrap"
              >
                Save Target
              </button>

            </form>
          </div>

          <div className="col-md-7 mt-3 mt-md-0 ps-md-4">

            <div className="d-flex justify-content-between align-items-center mb-1">

              <span className="fw-bold">
                Budget Utilization Status
              </span>

              <span className="fw-bold">
                {budgetProgress}% Spent
              </span>

            </div>

            <div
              className="progress"
              style={{ height: '22px' }}
            >

              <div
                className={`progress-bar progress-bar-striped progress-bar-animated ${
                  remainingBudget < 0
                    ? 'bg-danger'
                    : budgetProgress > 85
                    ? 'bg-warning'
                    : 'bg-success'
                }`}
                role="progressbar"
                style={{
                  width: `${budgetProgress}%`
                }}
              >
                ₹{totalActual.toLocaleString()}
              </div>

            </div>

            <small className="text-muted">

              Target Budget:{' '}
              <strong>
                ₹{totalBudget.toLocaleString()}
              </strong>

              {' | '}

              Actual Spent:{' '}
              <strong>
                ₹{totalActual.toLocaleString()}
              </strong>

            </small>

          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row g-3 mb-4">

        <div className="col-md-3">
          <div className="card text-center border-0 shadow-sm bg-primary text-white p-3">

            <h6>Total Budget</h6>

            <h3>
              ₹{totalBudget.toLocaleString()}
            </h3>

          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center border-0 shadow-sm bg-info text-white p-3">

            <h6>Planned Expenses</h6>

            <h3>
              ₹{totalPlanned.toLocaleString()}
            </h3>

          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-center border-0 shadow-sm bg-dark text-white p-3">

            <h6>Actual Expenses</h6>

            <h3>
              ₹{totalActual.toLocaleString()}
            </h3>

          </div>
        </div>

        <div className="col-md-3">

          <div
            className={`card text-center border-0 shadow-sm p-3 text-white ${
              remainingBudget >= 0
                ? 'bg-success'
                : 'bg-danger'
            }`}
          >

            <h6>Remaining Balance</h6>

            <h3>
              ₹{remainingBudget.toLocaleString()}
            </h3>

          </div>
        </div>

      </div>

      <div className="row">

        {/* EXPENSE FORM */}
        <div className="col-md-4 mb-4">

          <div className="card shadow-sm border-0">

            <div className="card-body p-4">

              <h4 className="card-title mb-3">
                {editingId
                  ? 'Edit Expense'
                  : 'Add New Expense'}
              </h4>

              <form onSubmit={handleSubmitExpense}>

                <div className="mb-3">

                  <label className="form-label fw-bold">
                    Expense Title / Item
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Venue Booking Advance"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        title: e.target.value
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
                    <option value="Venue">Venue</option>
                    <option value="Catering">Catering</option>
                    <option value="Decoration">Decoration</option>
                    <option value="Photography">Photography</option>
                    <option value="Makeup & Attire">Makeup & Attire</option>
                    <option value="Entertainment/DJ">Entertainment/DJ</option>
                    <option value="Invites & Gifts">Invites & Gifts</option>
                    <option value="Transport">Transport</option>
                    <option value="Other">Other</option>
                  </select>

                </div>

                <div className="mb-3">

                  <label className="form-label fw-bold">
                    Planned Amount (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="0.00"
                    value={formData.planned_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        planned_amount: e.target.value
                      })
                    }
                  />

                </div>

                <div className="mb-3">

                  <label className="form-label fw-bold">
                    Actual Spent Amount (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    placeholder="0.00"
                    value={formData.actual_amount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        actual_amount: e.target.value
                      })
                    }
                  />

                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold"
                >
                  {editingId
                    ? 'Update Expense'
                    : 'Record Expense'}
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

        {/* EXPENSE LIST */}
        <div className="col-md-8">

          <div className="card shadow-sm border-0 p-3 mb-3">

            <div className="row g-2">

              <div className="col-md-7">

                <input
                  type="text"
                  className="form-control"
                  placeholder="🔍 Search expense title..."
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

                  <option value="Venue">
                    Venue
                  </option>

                  <option value="Catering">
                    Catering
                  </option>

                  <option value="Decoration">
                    Decoration
                  </option>

                  <option value="Photography">
                    Photography
                  </option>

                  <option value="Makeup & Attire">
                    Makeup & Attire
                  </option>

                  <option value="Entertainment/DJ">
                    Entertainment/DJ
                  </option>

                  <option value="Invites & Gifts">
                    Invites & Gifts
                  </option>

                  <option value="Transport">
                    Transport
                  </option>

                  <option value="Other">
                    Other
                  </option>
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
                      <th>Title</th>
                      <th>Category</th>
                      <th>Planned (₹)</th>
                      <th>Actual Spent (₹)</th>
                      <th>Variance</th>
                      <th className="text-end">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredExpenses.length === 0 ? (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-4 text-muted"
                        >
                          No expense records found.
                        </td>
                      </tr>
                    ) : (
                      filteredExpenses.map((exp) => {

                        const planned =
                          Number(exp.planned_amount || 0);

                        const actual =
                          Number(exp.actual_amount || 0);

                        const variance =
                          planned - actual;

                        return (
                          <tr key={exp.id}>

                            <td className="fw-bold">
                              {exp.title}
                            </td>

                            <td>
                              <span className="badge bg-secondary">
                                {exp.category}
                              </span>
                            </td>

                            <td>
                              ₹{planned.toLocaleString()}
                            </td>

                            <td className="fw-bold">
                              ₹{actual.toLocaleString()}
                            </td>

                            <td>

                              {variance >= 0 ? (
                                <span className="text-success fw-bold">
                                  +₹{variance.toLocaleString()}
                                </span>
                              ) : (
                                <span className="text-danger fw-bold">
                                  -₹{Math.abs(
                                    variance
                                  ).toLocaleString()}
                                </span>
                              )}

                            </td>

                            <td className="text-end">

                              <button
                                className="btn btn-outline-primary btn-sm me-2"
                                onClick={() =>
                                  handleEdit(exp)
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() =>
                                  handleDelete(exp.id)
                                }
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