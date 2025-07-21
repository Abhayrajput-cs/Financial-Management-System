import React from 'react';
import './IncomeStats.css';

const IncomeStats = ({ incomes }) => {
  if (!incomes || incomes.length === 0) {
    return null;
  }

  // Calculate statistics
  const totalIncome = incomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);
  const averageIncome = totalIncome / incomes.length;
  
  // Get income by source
  const incomeBySource = incomes.reduce((acc, income) => {
    acc[income.source] = (acc[income.source] || 0) + parseFloat(income.amount);
    return acc;
  }, {});

  const topSources = Object.entries(incomeBySource)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  // Get recent income (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentIncomes = incomes.filter(income => 
    new Date(income.date) >= thirtyDaysAgo
  );
  const recentTotal = recentIncomes.reduce((sum, income) => sum + parseFloat(income.amount), 0);

  // Get monthly average
  const incomesByMonth = incomes.reduce((acc, income) => {
    const monthKey = new Date(income.date).toISOString().slice(0, 7); // YYYY-MM
    acc[monthKey] = (acc[monthKey] || 0) + parseFloat(income.amount);
    return acc;
  }, {});

  const monthlyAverage = Object.keys(incomesByMonth).length > 0 
    ? Object.values(incomesByMonth).reduce((sum, amount) => sum + amount, 0) / Object.keys(incomesByMonth).length
    : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="income-stats">
      <h3>Income Statistics</h3>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <span className="stat-label">Total Income</span>
            <span className="stat-value">{formatCurrency(totalIncome)}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-label">Average per Entry</span>
            <span className="stat-value">{formatCurrency(averageIncome)}</span>
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

      {topSources.length > 0 && (
        <div className="top-sources">
          <h4>Top Income Sources</h4>
          <div className="sources-list">
            {topSources.map(([source, amount], index) => (
              <div key={source} className="source-item">
                <div className="source-rank">#{index + 1}</div>
                <div className="source-details">
                  <span className="source-name">{source}</span>
                  <span className="source-amount">{formatCurrency(amount)}</span>
                </div>
                <div className="source-percentage">
                  {((amount / totalIncome) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeStats;
