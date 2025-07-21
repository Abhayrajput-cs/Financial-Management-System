import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { formatCurrencyFromUSD, selectedCurrency, getCurrencyInfo } = useCurrency();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');

    try {
      const response = await analyticsAPI.getDashboardData();
      if (response.data.success) {
        setDashboardData(response.data);
        setError('');
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        setError('Unable to connect to server. Please check your internet connection.');
      } else {
        setError('Failed to load dashboard data. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <LoadingSpinner size="large" message="Loading your financial dashboard..." />
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="dashboard-container">
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button
            className="retry-button"
            onClick={() => fetchDashboardData()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { overallSummary, recentSummary } = dashboardData || {};
  const currencyInfo = getCurrencyInfo();

  // Helper function to get trend indicator
  const getTrendIndicator = (current, previous) => {
    if (!previous || previous === 0) return '';
    const change = ((current - previous) / previous) * 100;
    if (change > 0) return `↗️ +${change.toFixed(1)}%`;
    if (change < 0) return `↘️ ${change.toFixed(1)}%`;
    return '➡️ 0%';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Welcome back, {user?.name || 'User'}! 👋</h1>
            <p>Here's your financial overview in {currencyInfo.flag} {currencyInfo.name}</p>
          </div>
          <div className="header-actions">
            <button
              className="refresh-button"
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
            >
              {refreshing ? '🔄' : '↻'} {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
        {error && (
          <div className="dashboard-error">
            <span>⚠️ {error}</span>
            <button onClick={() => fetchDashboardData(true)}>Retry</button>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card income">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <h3>Total Income</h3>
            <p className="amount">
              {formatCurrencyFromUSD(overallSummary?.totalIncome)}
            </p>
            <small className="card-subtitle">All time earnings</small>
          </div>
        </div>

        <div className="summary-card expense">
          <div className="card-icon">💸</div>
          <div className="card-content">
            <h3>Total Expenses</h3>
            <p className="amount">
              {formatCurrencyFromUSD(overallSummary?.totalExpenses)}
            </p>
            <small className="card-subtitle">All time spending</small>
          </div>
        </div>

        <div className="summary-card balance">
          <div className="card-icon">📊</div>
          <div className="card-content">
            <h3>Current Balance</h3>
            <p className={`amount ${overallSummary?.currentBalance >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrencyFromUSD(overallSummary?.currentBalance)}
            </p>
            <small className="card-subtitle">
              {overallSummary?.currentBalance >= 0 ? 'You\'re in the green!' : 'Consider reducing expenses'}
            </small>
          </div>
        </div>

        <div className="summary-card savings">
          <div className="card-icon">🎯</div>
          <div className="card-content">
            <h3>Savings Rate</h3>
            <p className="amount">
              {overallSummary?.savingsRate?.toFixed(1) || '0.0'}%
            </p>
            <small className="card-subtitle">
              {(overallSummary?.savingsRate || 0) >= 20 ? 'Excellent!' :
               (overallSummary?.savingsRate || 0) >= 10 ? 'Good progress' : 'Room for improvement'}
            </small>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <div className="section-header">
          <h2>Recent Activity (Last 30 Days)</h2>
          <span className="period-info">
            {recentSummary?.startDate && recentSummary?.endDate && (
              `${new Date(recentSummary.startDate).toLocaleDateString()} - ${new Date(recentSummary.endDate).toLocaleDateString()}`
            )}
          </span>
        </div>
        <div className="activity-summary">
          <div className="activity-item">
            <div className="activity-icon">💰</div>
            <div className="activity-details">
              <span className="activity-label">Income</span>
              <span className="activity-value positive">
                {formatCurrencyFromUSD(recentSummary?.income)}
              </span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">💸</div>
            <div className="activity-details">
              <span className="activity-label">Expenses</span>
              <span className="activity-value negative">
                {formatCurrencyFromUSD(recentSummary?.expenses)}
              </span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📊</div>
            <div className="activity-details">
              <span className="activity-label">Net Change</span>
              <span className={`activity-value ${recentSummary?.balance >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrencyFromUSD(recentSummary?.balance)}
              </span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📈</div>
            <div className="activity-details">
              <span className="activity-label">Savings Rate</span>
              <span className="activity-value">
                {recentSummary?.savingsRate?.toFixed(1) || '0.0'}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/add-income" className="action-button income-btn">
            <span className="btn-icon">💰</span>
            <div className="btn-content">
              <span className="btn-title">Add Income</span>
              <span className="btn-subtitle">Record new earnings</span>
            </div>
          </Link>
          <Link to="/add-expense" className="action-button expense-btn">
            <span className="btn-icon">💸</span>
            <div className="btn-content">
              <span className="btn-title">Add Expense</span>
              <span className="btn-subtitle">Track your spending</span>
            </div>
          </Link>
          <Link to="/analytics" className="action-button analytics-btn">
            <span className="btn-icon">📊</span>
            <div className="btn-content">
              <span className="btn-title">View Analytics</span>
              <span className="btn-subtitle">Charts and insights</span>
            </div>
          </Link>
          <Link to="/income" className="action-button view-btn">
            <span className="btn-icon">📋</span>
            <div className="btn-content">
              <span className="btn-title">Income History</span>
              <span className="btn-subtitle">View all earnings</span>
            </div>
          </Link>
          <Link to="/expenses" className="action-button view-btn">
            <span className="btn-icon">📋</span>
            <div className="btn-content">
              <span className="btn-title">Expense History</span>
              <span className="btn-subtitle">Review spending</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
