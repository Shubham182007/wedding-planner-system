import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Public Components
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Login from './components/Login';

// Admin Components
import AdminHeader from './components/AdminHeader';
import Dashboard from './components/Dashboard';
import Guests from './components/Guests';
import Events from './components/Events';
import Vendors from './components/Vendors';
import Budget from './components/Budget';
import AIBudgetPrediction from './components/AIBudgetPrediction';
import Seating from './components/Seating';
import Reports from './components/Reports';

// Layout component to selectively show public navbar or admin navbar
const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = ['/dashboard', '/guests', '/events', '/vendors', '/budget', '/ai-budget', '/seating', '/reports'].includes(location.pathname);

  return (
    <>
      {isAdminRoute ? <AdminHeader /> : <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Module Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/events" element={<Events />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/ai-budget" element={<AIBudgetPrediction />} />
          <Route path="/seating" element={<Seating />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;