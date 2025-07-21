import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CurrencySelector from './CurrencySelector';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  if (!isAuthenticated()) {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            💰 Financial Manager
          </Link>
          <div className="navbar-menu">
            <Link to="/login" className={`navbar-item ${isActive('/login')}`}>
              Login
            </Link>
            <Link to="/signup" className={`navbar-item ${isActive('/signup')}`}>
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          💰 Financial Manager
        </Link>
        
        <div className="navbar-menu">
          <Link to="/dashboard" className={`navbar-item ${isActive('/dashboard')}`}>
            Dashboard
          </Link>
          
          <div className="navbar-dropdown">
            <span className="navbar-item dropdown-trigger">
              Income ▼
            </span>
            <div className="dropdown-content">
              <Link to="/add-income" className="dropdown-item">
                Add Income
              </Link>
              <Link to="/income" className="dropdown-item">
                View Income
              </Link>
            </div>
          </div>
          
          <div className="navbar-dropdown">
            <span className="navbar-item dropdown-trigger">
              Expenses ▼
            </span>
            <div className="dropdown-content">
              <Link to="/add-expense" className="dropdown-item">
                Add Expense
              </Link>
              <Link to="/expenses" className="dropdown-item">
                View Expenses
              </Link>
            </div>
          </div>
          
          <Link to="/analytics" className={`navbar-item ${isActive('/analytics')}`}>
            Analytics
          </Link>

          {/* Currency Selector */}
          <div className="navbar-currency">
            <CurrencySelector compact={true} showLabel={false} />
          </div>

          <div className="navbar-dropdown">
            <span className="navbar-item dropdown-trigger">
              {user?.name || 'User'} ▼
            </span>
            <div className="dropdown-content">
              <button onClick={handleLogout} className="dropdown-item logout-btn">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
