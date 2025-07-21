import React from 'react';
import SimpleChart from './SimpleChart';
import { formatCurrency } from '../utils/formatters';
import './TrendAnalysis.css';

const TrendAnalysis = ({ trendData }) => {
  if (!trendData || trendData.length === 0) {
    return null;
  }

  // Prepare chart data for income vs expenses trend
  const incomeData = trendData.map(item => ({
    label: item.month,
    value: item.income,
    color: '#27ae60'
  }));

  const expenseData = trendData.map(item => ({
    label: item.month,
    value: item.expenses,
    color: '#e74c3c'
  }));

  const netData = trendData.map(item => ({
    label: item.month,
    value: item.difference,
    color: item.difference >= 0 ? '#27ae60' : '#e74c3c'
  }));

  // Calculate trend insights
  const calculateTrend = (data) => {
    if (data.length < 2) return { direction: 'stable', percentage: 0 };
    
    const recent = data[data.length - 1];
    const previous = data[data.length - 2];
    
    if (previous === 0) return { direction: 'stable', percentage: 0 };
    
    const change = ((recent - previous) / Math.abs(previous)) * 100;
    
    if (Math.abs(change) < 5) return { direction: 'stable', percentage: change };
    return { 
      direction: change > 0 ? 'increasing' : 'decreasing', 
      percentage: Math.abs(change) 
    };
  };

  const incomeValues = trendData.map(item => item.income);
  const expenseValues = trendData.map(item => item.expenses);
  const netValues = trendData.map(item => item.difference);

  const incomeTrend = calculateTrend(incomeValues);
  const expenseTrend = calculateTrend(expenseValues);
  const netTrend = calculateTrend(netValues);

  const getTrendIcon = (direction) => {
    switch (direction) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (direction, isExpense = false) => {
    if (direction === 'stable') return '#95a5a6';
    if (isExpense) {
      return direction === 'increasing' ? '#e74c3c' : '#27ae60';
    }
    return direction === 'increasing' ? '#27ae60' : '#e74c3c';
  };

  // Calculate averages
  const avgIncome = incomeValues.reduce((sum, val) => sum + val, 0) / incomeValues.length;
  const avgExpenses = expenseValues.reduce((sum, val) => sum + val, 0) / expenseValues.length;
  const avgNet = netValues.reduce((sum, val) => sum + val, 0) / netValues.length;

  return (
    <div className="trend-analysis">
      <h3>Financial Trends</h3>
      
      {/* Trend Summary */}
      <div className="trend-summary">
        <div className="trend-item">
          <div className="trend-header">
            <span className="trend-icon">{getTrendIcon(incomeTrend.direction)}</span>
            <span className="trend-label">Income Trend</span>
          </div>
          <div className="trend-details">
            <span 
              className="trend-direction"
              style={{ color: getTrendColor(incomeTrend.direction) }}
            >
              {incomeTrend.direction === 'stable' ? 'Stable' : 
               `${incomeTrend.direction} ${incomeTrend.percentage.toFixed(1)}%`}
            </span>
            <span className="trend-average">Avg: {formatCurrency(avgIncome)}</span>
          </div>
        </div>

        <div className="trend-item">
          <div className="trend-header">
            <span className="trend-icon">{getTrendIcon(expenseTrend.direction)}</span>
            <span className="trend-label">Expense Trend</span>
          </div>
          <div className="trend-details">
            <span 
              className="trend-direction"
              style={{ color: getTrendColor(expenseTrend.direction, true) }}
            >
              {expenseTrend.direction === 'stable' ? 'Stable' : 
               `${expenseTrend.direction} ${expenseTrend.percentage.toFixed(1)}%`}
            </span>
            <span className="trend-average">Avg: {formatCurrency(avgExpenses)}</span>
          </div>
        </div>

        <div className="trend-item">
          <div className="trend-header">
            <span className="trend-icon">{getTrendIcon(netTrend.direction)}</span>
            <span className="trend-label">Net Income Trend</span>
          </div>
          <div className="trend-details">
            <span 
              className="trend-direction"
              style={{ color: getTrendColor(netTrend.direction) }}
            >
              {netTrend.direction === 'stable' ? 'Stable' : 
               `${netTrend.direction} ${netTrend.percentage.toFixed(1)}%`}
            </span>
            <span className="trend-average">Avg: {formatCurrency(avgNet)}</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="trend-charts">
        <div className="chart-container">
          <SimpleChart
            data={incomeData}
            type="bar"
            title="Income Trend"
            height={200}
          />
        </div>

        <div className="chart-container">
          <SimpleChart
            data={expenseData}
            type="bar"
            title="Expense Trend"
            height={200}
          />
        </div>

        <div className="chart-container">
          <SimpleChart
            data={netData}
            type="bar"
            title="Net Income Trend"
            height={200}
          />
        </div>
      </div>

      {/* Insights */}
      <div className="trend-insights">
        <h4>Trend Insights</h4>
        <div className="insights-list">
          {incomeTrend.direction === 'increasing' && (
            <div className="insight-item positive">
              <span className="insight-icon">🎉</span>
              <span className="insight-text">
                Your income is trending upward by {incomeTrend.percentage.toFixed(1)}%
              </span>
            </div>
          )}
          
          {expenseTrend.direction === 'increasing' && (
            <div className="insight-item warning">
              <span className="insight-icon">⚠️</span>
              <span className="insight-text">
                Your expenses are increasing by {expenseTrend.percentage.toFixed(1)}%
              </span>
            </div>
          )}
          
          {expenseTrend.direction === 'decreasing' && (
            <div className="insight-item positive">
              <span className="insight-icon">👍</span>
              <span className="insight-text">
                Great! Your expenses are decreasing by {expenseTrend.percentage.toFixed(1)}%
              </span>
            </div>
          )}
          
          {netTrend.direction === 'increasing' && (
            <div className="insight-item positive">
              <span className="insight-icon">📈</span>
              <span className="insight-text">
                Your net income is improving by {netTrend.percentage.toFixed(1)}%
              </span>
            </div>
          )}
          
          {avgNet < 0 && (
            <div className="insight-item warning">
              <span className="insight-icon">🚨</span>
              <span className="insight-text">
                Your average monthly expenses exceed income. Consider budgeting.
              </span>
            </div>
          )}
          
          {avgNet > avgIncome * 0.2 && (
            <div className="insight-item positive">
              <span className="insight-icon">💰</span>
              <span className="insight-text">
                Excellent! You're saving over 20% of your income on average.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendAnalysis;
