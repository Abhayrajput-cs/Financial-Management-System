import React from 'react';
import SimpleChart from './SimpleChart';
import { formatCurrency, formatDate, groupByMonth, calculateTotal } from '../utils/formatters';
import './ExpenseAnalytics.css';

const ExpenseAnalytics = ({ expenses }) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="expense-analytics">
        <div className="no-data">
          <h3>No expense data available</h3>
          <p>Add some expenses to see analytics and insights.</p>
        </div>
      </div>
    );
  }

  // Group expenses by month for trend analysis
  const monthlyExpenses = groupByMonth(expenses);
  const monthlyTrendData = Object.entries(monthlyExpenses)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6) // Last 6 months
    .map(([month, monthExpenses]) => ({
      label: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      value: calculateTotal(monthExpenses),
      color: '#e74c3c'
    }));

  // Category breakdown
  const categoryBreakdown = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  const categoryChartData = Object.entries(categoryBreakdown)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8) // Top 8 categories
    .map(([category, amount], index) => ({
      label: category,
      value: amount,
      color: getCategoryColor(category, index)
    }));

  // Weekly spending pattern
  const weeklyPattern = expenses.reduce((acc, expense) => {
    const dayOfWeek = new Date(expense.date).getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[dayOfWeek];
    acc[dayName] = (acc[dayName] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  const weeklyChartData = Object.entries(weeklyPattern)
    .map(([day, amount]) => ({
      label: day.slice(0, 3), // Short day names
      value: amount,
      color: '#3498db'
    }));

  // Calculate insights
  const totalExpense = calculateTotal(expenses);
  const averageDaily = totalExpense / Math.max(1, getDaysBetween(expenses));
  const highestCategory = Object.entries(categoryBreakdown)
    .sort(([,a], [,b]) => b - a)[0];
  const mostExpensiveDay = Object.entries(weeklyPattern)
    .sort(([,a], [,b]) => b - a)[0];

  function getCategoryColor(category, index) {
    const colors = {
      'Food & Dining': '#e74c3c',
      'Transportation': '#3498db',
      'Shopping': '#9b59b6',
      'Entertainment': '#f39c12',
      'Bills & Utilities': '#34495e',
      'Healthcare': '#e67e22',
      'Education': '#2ecc71',
      'Travel': '#1abc9c',
      'Home & Garden': '#95a5a6',
      'Personal Care': '#ff69b4',
      'Insurance': '#8e44ad',
      'Taxes': '#c0392b',
      'Business': '#27ae60',
      'Gifts & Donations': '#f1c40f'
    };
    return colors[category] || `hsl(${index * 45}, 70%, 60%)`;
  }

  function getDaysBetween(expenses) {
    if (expenses.length === 0) return 1;
    const dates = expenses.map(e => new Date(e.date));
    const earliest = new Date(Math.min(...dates));
    const latest = new Date(Math.max(...dates));
    return Math.max(1, Math.ceil((latest - earliest) / (1000 * 60 * 60 * 24)) + 1);
  }

  return (
    <div className="expense-analytics">
      <h3>Expense Analytics</h3>

      {/* Key Insights */}
      <div className="insights-summary">
        <div className="insight-card">
          <div className="insight-icon">💰</div>
          <div className="insight-content">
            <span className="insight-label">Daily Average</span>
            <span className="insight-value">{formatCurrency(averageDaily)}</span>
          </div>
        </div>
        
        <div className="insight-card">
          <div className="insight-icon">🏆</div>
          <div className="insight-content">
            <span className="insight-label">Top Category</span>
            <span className="insight-value">{highestCategory?.[0] || 'N/A'}</span>
          </div>
        </div>
        
        <div className="insight-card">
          <div className="insight-icon">📅</div>
          <div className="insight-content">
            <span className="insight-label">Highest Spending Day</span>
            <span className="insight-value">{mostExpensiveDay?.[0] || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Monthly Trend */}
        {monthlyTrendData.length > 1 && (
          <div className="chart-container">
            <SimpleChart 
              data={monthlyTrendData}
              type="bar"
              title="Monthly Spending Trend"
              height={200}
            />
          </div>
        )}

        {/* Category Breakdown */}
        {categoryChartData.length > 0 && (
          <div className="chart-container">
            <SimpleChart 
              data={categoryChartData}
              type="pie"
              title="Spending by Category"
              height={250}
            />
          </div>
        )}

        {/* Weekly Pattern */}
        {weeklyChartData.length > 0 && (
          <div className="chart-container">
            <SimpleChart 
              data={weeklyChartData}
              type="bar"
              title="Spending by Day of Week"
              height={200}
            />
          </div>
        )}
      </div>

      {/* Detailed Breakdown */}
      <div className="detailed-breakdown">
        <h4>Category Details</h4>
        <div className="breakdown-list">
          {Object.entries(categoryBreakdown)
            .sort(([,a], [,b]) => b - a)
            .map(([category, amount]) => (
              <div key={category} className="breakdown-item">
                <div className="breakdown-category">
                  <span 
                    className="category-indicator"
                    style={{ backgroundColor: getCategoryColor(category) }}
                  />
                  <span className="category-name">{category}</span>
                </div>
                <div className="breakdown-amount">
                  <span className="amount">{formatCurrency(amount)}</span>
                  <span className="percentage">
                    {((amount / totalExpense) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalytics;
