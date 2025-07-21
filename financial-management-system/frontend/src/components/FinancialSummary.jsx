import React from 'react';
import { formatCurrency } from '../utils/formatters';
import './FinancialSummary.css';

const FinancialSummary = ({ summary }) => {
  if (!summary) return null;

  const getHealthScore = () => {
    const { totalIncome, totalExpenses, savingsRate } = summary;
    
    if (totalIncome === 0) return { score: 0, label: 'No Data', color: '#95a5a6' };
    
    let score = 0;
    
    // Positive balance contributes 40%
    if (totalIncome > totalExpenses) score += 40;
    
    // Savings rate contributes 60%
    if (savingsRate >= 20) score += 60;
    else if (savingsRate >= 10) score += 40;
    else if (savingsRate >= 5) score += 20;
    
    if (score >= 80) return { score, label: 'Excellent', color: '#27ae60' };
    if (score >= 60) return { score, label: 'Good', color: '#2ecc71' };
    if (score >= 40) return { score, label: 'Fair', color: '#f39c12' };
    if (score >= 20) return { score, label: 'Poor', color: '#e67e22' };
    return { score, label: 'Critical', color: '#e74c3c' };
  };

  const healthScore = getHealthScore();

  const getRecommendations = () => {
    const { totalIncome, totalExpenses, savingsRate } = summary;
    const recommendations = [];

    if (totalExpenses > totalIncome) {
      recommendations.push({
        type: 'warning',
        title: 'Spending Exceeds Income',
        message: 'Your expenses are higher than your income. Consider reducing unnecessary expenses.',
        icon: '⚠️'
      });
    }

    if (savingsRate < 10) {
      recommendations.push({
        type: 'info',
        title: 'Low Savings Rate',
        message: 'Try to save at least 10-20% of your income for financial security.',
        icon: '💡'
      });
    }

    if (savingsRate >= 20) {
      recommendations.push({
        type: 'success',
        title: 'Great Savings Rate!',
        message: 'You\'re saving a healthy percentage of your income. Keep it up!',
        icon: '🎉'
      });
    }

    if (totalIncome > 0 && totalExpenses === 0) {
      recommendations.push({
        type: 'info',
        title: 'Track Your Expenses',
        message: 'Start tracking your expenses to get better insights into your spending habits.',
        icon: '📊'
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="financial-summary">
      <h3>Overall Financial Health</h3>
      
      {/* Health Score */}
      <div className="health-score-section">
        <div className="health-score-card">
          <div className="score-circle">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#e1e8ed"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke={healthScore.color}
                strokeWidth="8"
                strokeDasharray={`${(healthScore.score / 100) * 314} 314`}
                strokeDashoffset="0"
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dasharray 1s ease-in-out' }}
              />
              <text
                x="60"
                y="65"
                textAnchor="middle"
                fontSize="24"
                fontWeight="bold"
                fill={healthScore.color}
              >
                {healthScore.score}
              </text>
            </svg>
          </div>
          <div className="score-details">
            <h4>Financial Health Score</h4>
            <p className="score-label" style={{ color: healthScore.color }}>
              {healthScore.label}
            </p>
            <p className="score-description">
              Based on your income, expenses, and savings rate
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="key-metrics">
        <div className="metric-item">
          <span className="metric-icon">💰</span>
          <div className="metric-content">
            <span className="metric-label">Total Income</span>
            <span className="metric-value income">{formatCurrency(summary.totalIncome)}</span>
          </div>
        </div>

        <div className="metric-item">
          <span className="metric-icon">💸</span>
          <div className="metric-content">
            <span className="metric-label">Total Expenses</span>
            <span className="metric-value expense">{formatCurrency(summary.totalExpenses)}</span>
          </div>
        </div>

        <div className="metric-item">
          <span className="metric-icon">📊</span>
          <div className="metric-content">
            <span className="metric-label">Net Worth</span>
            <span className={`metric-value ${summary.currentBalance >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(summary.currentBalance)}
            </span>
          </div>
        </div>

        <div className="metric-item">
          <span className="metric-icon">🎯</span>
          <div className="metric-content">
            <span className="metric-label">Savings Rate</span>
            <span className="metric-value">{summary.savingsRate?.toFixed(1) || '0.0'}%</span>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="recommendations">
          <h4>Recommendations</h4>
          <div className="recommendations-list">
            {recommendations.map((rec, index) => (
              <div key={index} className={`recommendation-item ${rec.type}`}>
                <span className="rec-icon">{rec.icon}</span>
                <div className="rec-content">
                  <h5>{rec.title}</h5>
                  <p>{rec.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Financial Ratios */}
      <div className="financial-ratios">
        <h4>Financial Ratios</h4>
        <div className="ratios-grid">
          <div className="ratio-item">
            <span className="ratio-label">Expense Ratio</span>
            <span className="ratio-value">
              {summary.totalIncome > 0 
                ? ((summary.totalExpenses / summary.totalIncome) * 100).toFixed(1)
                : '0.0'
              }%
            </span>
          </div>
          
          <div className="ratio-item">
            <span className="ratio-label">Savings Ratio</span>
            <span className="ratio-value">
              {summary.savingsRate?.toFixed(1) || '0.0'}%
            </span>
          </div>
          
          <div className="ratio-item">
            <span className="ratio-label">Financial Stability</span>
            <span className="ratio-value">
              {summary.currentBalance >= summary.totalExpenses * 3 ? 'High' :
               summary.currentBalance >= summary.totalExpenses ? 'Medium' : 'Low'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialSummary;
