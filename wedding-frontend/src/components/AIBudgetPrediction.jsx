import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AIBudgetPrediction() {
  const [guestCount, setGuestCount] = useState(250);
  const [venueTier, setVenueTier] = useState('Banquet_Hall');
  const [cateringTier, setCateringTier] = useState('Standard');
  const [decorTier, setDecorTier] = useState('Elegant');
  const [photographyTier, setPhotographyTier] = useState('Standard');
  const [entertainmentTier, setEntertainmentTier] = useState('Live_Band');
  const [attireTier, setAttireTier] = useState('Standard');

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [applyMessage, setApplyMessage] = useState('');

  const navigate = useNavigate();

  // Normal user login
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Admin login
  const isAdminAuthenticated =
    localStorage.getItem('isAdminAuthenticated') === 'true';

  // Admin uses selected wedding ID
  // Normal user uses own user ID
  const activeClientId =
    localStorage.getItem('selectedClientId') || user?.id;

  useEffect(() => {
    // Redirect only when neither normal user nor admin is logged in
    if (!user && !isAdminAuthenticated) {
      navigate('/login');
      return;
    }
  }, []);

  const handlePredict = async (e) => {
    e.preventDefault();

    if (!activeClientId) {
      setApplyMessage(
        '⚠️ No wedding selected. Please go to Dashboard and click Manage Wedding.'
      );
      return;
    }

    setLoading(true);
    setApplyMessage('');

    try {
      const res = await axios.post(
        'https://wedding-planner-backend-zjgi.onrender.com/api/predict-budget',
        {
          user_id: activeClientId,
          guest_count: guestCount,
          venue_tier: venueTier,
          catering_tier: cateringTier,
          decor_tier: decorTier,
          photography_tier: photographyTier,
          entertainment_tier: entertainmentTier,
          attire_tier: attireTier
        }
      );

      setPrediction(res.data.breakdown);
    } catch (err) {
      console.error('Error generating AI estimate:', err);

      setApplyMessage(
        err.response?.data?.message ||
          'Failed to generate AI budget estimate.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApplyToBudget = async () => {
    if (!prediction || !activeClientId) return;

    try {
      await axios.post(
        'https://wedding-planner-backend-zjgi.onrender.com/api/budget/set-target',
        {
          user_id: activeClientId,
          total_budget: prediction.estimated_total
        }
      );

      setApplyMessage(
        '🎉 Applied estimated total as your Target Budget!'
      );

      setTimeout(() => {
        setApplyMessage('');
      }, 4000);
    } catch (err) {
      console.error('Failed to update target budget:', err);

      setApplyMessage(
        err.response?.data?.message ||
          'Failed to update target budget.'
      );
    }
  };

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
          <h2>🤖 AI Budget Prediction Engine</h2>

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

      {applyMessage && (
        <div className="alert alert-info">
          {applyMessage}
        </div>
      )}

      <div className="row g-4">

        {/* FORM INPUTS */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">

              <h4 className="card-title mb-3 text-primary fw-bold">
                ⚙️ Select Planning Parameters
              </h4>

              <form onSubmit={handlePredict}>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Expected Guests Count
                  </label>

                  <input
                    type="number"
                    min="10"
                    max="5000"
                    className="form-control"
                    value={guestCount}
                    onChange={(e) =>
                      setGuestCount(e.target.value)
                    }
                    required
                  />

                  <small className="text-muted">
                    Catering costs scale directly with guest numbers.
                  </small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Venue Tier
                  </label>

                  <select
                    className="form-select"
                    value={venueTier}
                    onChange={(e) =>
                      setVenueTier(e.target.value)
                    }
                  >
                    <option value="Community_Hall">
                      Community Hall / Open Grounds (Budget)
                    </option>

                    <option value="Banquet_Hall">
                      AC Banquet Hall (Standard)
                    </option>

                    <option value="Resort_Hotel">
                      4-Star Resort / Heritage Hotel (Premium)
                    </option>

                    <option value="Luxury_Palace">
                      5-Star Luxury Hotel / Palace (Luxury)
                    </option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Catering & Menu Style
                  </label>

                  <select
                    className="form-select"
                    value={cateringTier}
                    onChange={(e) =>
                      setCateringTier(e.target.value)
                    }
                  >
                    <option value="Economy">
                      Economy (~₹600/plate - Standard Buffet)
                    </option>

                    <option value="Standard">
                      Standard (~₹1,200/plate - Multi-cuisine)
                    </option>

                    <option value="Premium">
                      Premium (~₹2,200/plate - Gourmet Counters)
                    </option>

                    <option value="Luxury">
                      Luxury (~₹3,500/plate - International Chefs)
                    </option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Decoration & Theme Scale
                  </label>

                  <select
                    className="form-select"
                    value={decorTier}
                    onChange={(e) =>
                      setDecorTier(e.target.value)
                    }
                  >
                    <option value="Minimal">
                      Minimal & Floral (Simple)
                    </option>

                    <option value="Elegant">
                      Elegant Theme Decor (Standard)
                    </option>

                    <option value="Grand">
                      Grand Stage & Lighting setup (Premium)
                    </option>

                    <option value="Royal">
                      Royal Destination Theme Setups (Luxury)
                    </option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Photography & Videography
                  </label>

                  <select
                    className="form-select"
                    value={photographyTier}
                    onChange={(e) =>
                      setPhotographyTier(e.target.value)
                    }
                  >
                    <option value="Basic">
                      Traditional Photography Only
                    </option>

                    <option value="Standard">
                      Candid + Traditional Photography
                    </option>

                    <option value="Cinematic">
                      Cinematic Teasers + Drone Coverage
                    </option>

                    <option value="Celebrity">
                      Celebrity Style Production Team
                    </option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Music & Entertainment
                  </label>

                  <select
                    className="form-select"
                    value={entertainmentTier}
                    onChange={(e) =>
                      setEntertainmentTier(e.target.value)
                    }
                  >
                    <option value="Basic_DJ">
                      Local Sound & DJ Setup
                    </option>

                    <option value="Live_Band">
                      Live Band / Sangeet Choreographer
                    </option>

                    <option value="Celebrity_DJ">
                      Popular DJ + LED Visual Setup
                    </option>

                    <option value="Full_Show">
                      Celebrity Artists / Artists Troupe
                    </option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    Bridal Attire & Makeup
                  </label>

                  <select
                    className="form-select"
                    value={attireTier}
                    onChange={(e) =>
                      setAttireTier(e.target.value)
                    }
                  >
                    <option value="Budget">
                      Standard Local Artists & Ready-made Attire
                    </option>

                    <option value="Standard">
                      Professional Artists & Boutique Outfits
                    </option>

                    <option value="Designer">
                      Top Bridal Studio & Designer Collections
                    </option>

                    <option value="High_End">
                      Celebrity Makeup Artist & High-Fashion
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-bold py-2"
                  disabled={loading}
                >
                  {loading
                    ? 'Calculating Estimate...'
                    : '🔮 Generate AI Cost Estimate'}
                </button>

              </form>
            </div>
          </div>
        </div>

        {/* PREDICTION RESULTS */}
        <div className="col-lg-6">

          {prediction ? (
            <div className="card shadow-sm border-0 border-top border-success border-4">
              <div className="card-body p-4">

                <div className="text-center mb-4">

                  <span className="badge bg-success mb-2 px-3 py-2 fs-6">
                    AI Estimate Ready
                  </span>

                  <h5 className="text-muted mb-1">
                    Total Predicted Wedding Budget
                  </h5>

                  <h1 className="fw-bold text-success display-5">
                    ₹{Number(
                      prediction.estimated_total || 0
                    ).toLocaleString()}
                  </h1>

                  <p className="text-muted small">
                    Based on {guestCount} guests and selected options.
                  </p>

                </div>

                <h6 className="fw-bold mb-3 border-bottom pb-2">
                  📋 Estimated Itemized Breakdown
                </h6>

                <ul className="list-group list-group-flush mb-4">

                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>🍽️ Catering Services</span>

                    <strong className="text-dark">
                      ₹{Number(
                        prediction.catering || 0
                      ).toLocaleString()}
                    </strong>
                  </li>

                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>🏰 Venue Rental</span>

                    <strong className="text-dark">
                      ₹{Number(
                        prediction.venue || 0
                      ).toLocaleString()}
                    </strong>
                  </li>

                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>🌸 Decor & Themes</span>

                    <strong className="text-dark">
                      ₹{Number(
                        prediction.decor || 0
                      ).toLocaleString()}
                    </strong>
                  </li>

                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>📸 Photography & Video</span>

                    <strong className="text-dark">
                      ₹{Number(
                        prediction.photography || 0
                      ).toLocaleString()}
                    </strong>
                  </li>

                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>🎶 Music & Entertainment</span>

                    <strong className="text-dark">
                      ₹{Number(
                        prediction.entertainment || 0
                      ).toLocaleString()}
                    </strong>
                  </li>

                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <span>💄 Attire & Makeup</span>

                    <strong className="text-dark">
                      ₹{Number(
                        prediction.attire || 0
                      ).toLocaleString()}
                    </strong>
                  </li>

                  <li className="list-group-item d-flex justify-content-between align-items-center bg-light">
                    <span>🛡️ Emergency Buffer (8%)</span>

                    <strong className="text-warning">
                      ₹{Number(
                        prediction.contingency_buffer || 0
                      ).toLocaleString()}
                    </strong>
                  </li>

                </ul>

                <button
                  className="btn btn-success w-100 fw-bold py-2"
                  onClick={handleApplyToBudget}
                >
                  🎯 Apply Estimate as Target Budget
                </button>

              </div>
            </div>
          ) : (
            <div className="card shadow-sm border-0 bg-light h-100 d-flex justify-content-center align-items-center text-center p-5">

              <div className="fs-1 mb-3">
                🤖
              </div>

              <h5 className="fw-bold">
                No Prediction Generated Yet
              </h5>

              <p className="text-muted small">
                Adjust your guest count and preference parameters
                on the left, then click
                <strong> "Generate AI Cost Estimate"</strong>
                {' '}to get a breakdown.
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}