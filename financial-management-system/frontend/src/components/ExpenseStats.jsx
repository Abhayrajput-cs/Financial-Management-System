import React from 'react';
import SimpleChart from './SimpleChart';
import './ExpenseStats.css';

const ExpenseStats = ({ expenses }) => {
  if (!expenses || expenses.length === 0) {
    return null;
  }

  // Calculate statistics
  const totalExpense = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const averageExpense = totalExpense / expenses.length;
  
  // Get expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  const topCategories = Object.entries(expensesByCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Get recent expenses (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentExpenses = expenses.filter(expense => 
    new Date(expense.date) >= thirtyDaysAgo
  );
  const recentTotal = recentExpenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  // Get monthly average
  const expensesByMonth = expenses.reduce((acc, expense) => {
    const monthKey = new Date(expense.date).toISOString().slice(0, 7); // YYYY-MM
    acc[monthKey] = (acc[monthKey] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  const monthlyAverage = Object.keys(expensesByMonth).length > 0 
    ? Object.values(expensesByMonth).reduce((sum, amount) => sum + amount, 0) / Object.keys(expensesByMonth).length
    : 0;

  // Prepare chart data
  const chartData = topCategories.map(([category, amount], index) => ({
    label: category,
    value: amount,
    color: getCategoryColor(category, index)
  }));

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCategoryColor = (category, index) => {
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
    return colors[category] || `hsl(${index * 60}, 70%, 60%)`;
  };

  return (
    <div className="expense-stats">
      <h3>Expense Statistics</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💸</div>
          <div className="stat-content">
            <span className="stat-label">Total Expenses</span>
            <span className="stat-value">{formatCurrency(totalExpense)}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-label">Average per Entry</span>
            <span className="stat-value">{formatCurrency(averageExpense)}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <span className="stat-label">Last 30 Days</span>
            <span className="stat-value">{formatCurrency(recentTotal)}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <span className="stat-label">Monthly Average</span>
            <span className="stat-value">{formatCurrency(monthlyAverage)}</span>
          </div>
        </div>
      </div>

      {/* Category Breakdown Chart */}
      {chartData.length > 0 && (
        <div className="chart-section">
          <SimpleChart 
            data={chartData} 
            type="pie" 
            title="Expenses by Category"
            height={250}
          />
        </div>
      )}

      {topCategories.length > 0 && (
        <div className="top-categories">
          <h4>Top Expense Categories</h4>
          <div className="categories-list">
            {topCategories.map(([category, amount], index) => (
              <div key={category} className="category-item">
                <div className="category-rank">#{index + 1}</div>
                <div className="category-details">
                  <span className="category-name">
                    <span 
                      className="category-color"
                      style={{ backgroundColor: getCategoryColor(category, index) }}
                    />
                    {category}
                  </span>
                  <span className="category-amount">{formatCurrency(amount)}</span>
                </div>
                <div className="category-percentage">
                  {((amount / totalExpense) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spending Insights */}
      <div className="spending-insights">
        <h4>Spending Insights</h4>
        <div className="insights-grid">
          <div className="insight-item">
            <span className="insight-icon">🏆</span>
            <div className="insight-content">
              <span className="insight-label">Highest Category</span>
              <span className="insight-value">{topCategories[0]?.[0] || 'N/A'}</span>
            </div>
          </div>
          <div className="insight-item">
            <span className="insight-icon">📊</span>
            <div className="insight-content">
              <span className="insight-label">Categories Used</span>
              <span className="insight-value">{Object.keys(expensesByCategory).length}</span>
            </div>
          </div>
          <div className="insight-item">
            <span className="insight-icon">📈</span>
            <div className="insight-content">
              <span className="insight-label">Daily Average</span>
              <span className="insight-value">{formatCurrency(recentTotal / 30)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseStats;
