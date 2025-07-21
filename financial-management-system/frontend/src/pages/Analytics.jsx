import React, { useState, useEffect } from 'react';
import { analyticsAPI, incomeAPI, expenseAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import SimpleChart from '../components/SimpleChart';
import FinancialSummary from '../components/FinancialSummary';
import TrendAnalysis from '../components/TrendAnalysis';
import CategoryAnalysis from '../components/CategoryAnalysis';
import { formatCurrency, formatDate, getDateRange } from '../utils/formatters';
import './Analytics.css';

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const periods = [
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'quarter', label: 'Last 3 Months' },
    { value: 'year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod, customDateRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError('');

    try {
      // Get date range based on selected period
      let dateRange = {};
      if (selectedPeriod === 'custom') {
        if (customDateRange.startDate && customDateRange.endDate) {
          dateRange = {
            startDate: customDateRange.startDate,
            endDate: customDateRange.endDate
          };
        }
      } else {
        dateRange = getDateRange(selectedPeriod);
      }

      // Fetch all data in parallel
      const [analyticsResponse, incomeResponse, expenseResponse] = await Promise.all([
        analyticsAPI.getDashboardData(),
        incomeAPI.getAll(dateRange),
        expenseAPI.getAll(dateRange)
      ]);

      if (analyticsResponse.data.success) {
        setAnalyticsData(analyticsResponse.data);
      }

      if (incomeResponse.data.success) {
        setIncomes(incomeResponse.data.incomes || []);
      }

      if (expenseResponse.data.success) {
        setExpenses(expenseResponse.data.expenses || []);
      }

    } catch (error) {
      console.error('Analytics error:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        setError('Unable to connect to server. Please check your internet connection.');
      } else {
        setError('Failed to load analytics data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculatePeriodSummary = () => {
    const totalIncome = incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const netIncome = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      netIncome,
      savingsRate,
      incomeCount: incomes.length,
      expenseCount: expenses.length
    };
  };

  const getIncomeVsExpenseChart = () => {
    const summary = calculatePeriodSummary();
    return [
      {
        label: 'Income',
        value: summary.totalIncome,
        color: '#27ae60'
      },
      {
        label: 'Expenses',
        value: summary.totalExpenses,
        color: '#e74c3c'
      }
    ];
  };

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="large" message="Loading financial analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button
            className="retry-button"
            onClick={fetchAnalyticsData}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const periodSummary = calculatePeriodSummary();
  const incomeVsExpenseData = getIncomeVsExpenseChart();

  return (
    <div className="page-container">
      <div className="analytics-header">
        <div className="header-content">
          <div>
            <h1>Financial Analytics</h1>
            <p>Comprehensive insights into your financial data</p>
          </div>
          <div className="period-selector">
            <label htmlFor="period">Time Period:</label>
            <select
              id="period"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedPeriod === 'custom' && (
          <div className="custom-date-range">
            <div className="date-inputs">
              <div className="date-group">
                <label>Start Date:</label>
                <input
                  type="date"
                  value={customDateRange.startDate}
                  onChange={(e) => setCustomDateRange({
                    ...customDateRange,
                    startDate: e.target.value
                  })}
                />
              </div>
              <div className="date-group">
                <label>End Date:</label>
                <input
                  type="date"
                  value={customDateRange.endDate}
                  onChange={(e) => setCustomDateRange({
                    ...customDateRange,
                    endDate: e.target.value
                  })}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Period Summary */}
      <div className="period-summary">
        <h3>
          {selectedPeriod === 'custom' && customDateRange.startDate && customDateRange.endDate
            ? `${formatDate(customDateRange.startDate)} - ${formatDate(customDateRange.endDate)}`
            : periods.find(p => p.value === selectedPeriod)?.label || 'Summary'
          }
        </h3>
        <div className="summary-cards">
          <div className="summary-card income">
            <div className="card-icon">💰</div>
            <div className="card-content">
              <span className="card-label">Total Income</span>
              <span className="card-value">{formatCurrency(periodSummary.totalIncome)}</span>
              <span className="card-subtitle">{periodSummary.incomeCount} entries</span>
            </div>
          </div>

          <div className="summary-card expense">
            <div className="card-icon">💸</div>
            <div className="card-content">
              <span className="card-label">Total Expenses</span>
              <span className="card-value">{formatCurrency(periodSummary.totalExpenses)}</span>
              <span className="card-subtitle">{periodSummary.expenseCount} entries</span>
            </div>
          </div>

          <div className="summary-card net">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <span className="card-label">Net Income</span>
              <span className={`card-value ${periodSummary.netIncome >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(periodSummary.netIncome)}
              </span>
              <span className="card-subtitle">
                {periodSummary.netIncome >= 0 ? 'Surplus' : 'Deficit'}
              </span>
            </div>
          </div>

          <div className="summary-card savings">
            <div className="card-icon">🎯</div>
            <div className="card-content">
              <span className="card-label">Savings Rate</span>
              <span className="card-value">{periodSummary.savingsRate.toFixed(1)}%</span>
              <span className="card-subtitle">
                {periodSummary.savingsRate >= 20 ? 'Excellent' :
                 periodSummary.savingsRate >= 10 ? 'Good' : 'Needs improvement'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Income vs Expenses */}
        {incomeVsExpenseData.some(item => item.value > 0) && (
          <div className="chart-container">
            <SimpleChart
              data={incomeVsExpenseData}
              type="pie"
              title="Income vs Expenses"
              height={250}
            />
          </div>
        )}

        {/* Overall Summary from API */}
        {analyticsData?.overallSummary && (
          <FinancialSummary summary={analyticsData.overallSummary} />
        )}
      </div>

      {/* Detailed Analysis Components */}
      <div className="analysis-section">
        {analyticsData?.trendData && (
          <TrendAnalysis trendData={analyticsData.trendData} />
        )}

        {expenses.length > 0 && (
          <CategoryAnalysis
            expenses={expenses}
            incomes={incomes}
            period={selectedPeriod}
          />
        )}
      </div>

      {/* No Data State */}
      {incomes.length === 0 && expenses.length === 0 && (
        <div className="no-data-state">
          <div className="no-data-content">
            <h3>No financial data found</h3>
            <p>Add some income and expense entries to see detailed analytics.</p>
            <div className="no-data-actions">
              <a href="/add-income" className="btn btn-primary">Add Income</a>
              <a href="/add-expense" className="btn btn-secondary">Add Expense</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
