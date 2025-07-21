import React from 'react';
import SimpleChart from './SimpleChart';
import { formatCurrency, calculateTotal } from '../utils/formatters';
import './CategoryAnalysis.css';

const CategoryAnalysis = ({ expenses, incomes, period }) => {
  if (!expenses || expenses.length === 0) {
    return null;
  }

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  // Group incomes by source
  const incomesBySource = incomes.reduce((acc, income) => {
    acc[income.source] = (acc[income.source] || 0) + parseFloat(income.amount);
    return acc;
  }, {});

  const totalExpenses = calculateTotal(expenses);
  const totalIncomes = calculateTotal(incomes);

  // Prepare chart data for expenses
  const expenseChartData = Object.entries(expensesByCategory)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([category, amount], index) => ({
      label: category,
      value: amount,
      color: getCategoryColor(category, index)
    }));

  // Prepare chart data for incomes
  const incomeChartData = Object.entries(incomesBySource)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 6)
    .map(([source, amount], index) => ({
      label: source,
      value: amount,
      color: getIncomeColor(source, index)
    }));

  // Calculate category insights
  const getTopCategory = () => {
    const sorted = Object.entries(expensesByCategory).sort(([,a], [,b]) => b - a);
    return sorted[0] || ['N/A', 0];
  };

  const getTopIncomeSource = () => {
    const sorted = Object.entries(incomesBySource).sort(([,a], [,b]) => b - a);
    return sorted[0] || ['N/A', 0];
  };

  const getCategoryBudgetStatus = () => {
    const [topCategory, topAmount] = getTopCategory();
    const percentage = totalExpenses > 0 ? (topAmount / totalExpenses) * 100 : 0;
    
    if (percentage > 50) return { status: 'high', message: 'Consider diversifying expenses' };
    if (percentage > 30) return { status: 'medium', message: 'Monitor this category' };
    return { status: 'good', message: 'Well-balanced spending' };
  };

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

  function getIncomeColor(source, index) {
    const colors = {
      'Salary': '#27ae60',
      'Freelance': '#2ecc71',
      'Investment': '#3498db',
      'Business': '#1abc9c',
      'Rental Income': '#16a085',
      'Bonus': '#f39c12',
      'Commission': '#e67e22'
    };
    return colors[source] || `hsl(${index * 60 + 120}, 70%, 50%)`;
  }

  const [topCategory, topCategoryAmount] = getTopCategory();
  const [topIncomeSource, topIncomeAmount] = getTopIncomeSource();
  const budgetStatus = getCategoryBudgetStatus();

  return (
    <div className="category-analysis">
      <h3>Category Analysis</h3>

      {/* Key Insights */}
      <div className="category-insights">
        <div className="insight-card">
          <div className="insight-icon">🏆</div>
          <div className="insight-content">
            <span className="insight-label">Top Expense Category</span>
            <span className="insight-value">{topCategory}</span>
            <span className="insight-amount">{formatCurrency(topCategoryAmount)}</span>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon">💰</div>
          <div className="insight-content">
            <span className="insight-label">Top Income Source</span>
            <span className="insight-value">{topIncomeSource}</span>
            <span className="insight-amount">{formatCurrency(topIncomeAmount)}</span>
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-icon">📊</div>
          <div className="insight-content">
            <span className="insight-label">Budget Status</span>
            <span className={`insight-value ${budgetStatus.status}`}>
              {budgetStatus.status.charAt(0).toUpperCase() + budgetStatus.status.slice(1)}
            </span>
            <span className="insight-message">{budgetStatus.message}</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="category-charts">
        {expenseChartData.length > 0 && (
          <div className="chart-section">
            <SimpleChart
              data={expenseChartData}
              type="pie"
              title="Expenses by Category"
              height={300}
            />
          </div>
        )}

        {incomeChartData.length > 0 && (
          <div className="chart-section">
            <SimpleChart
              data={incomeChartData}
              type="pie"
              title="Income by Source"
              height={300}
            />
          </div>
        )}
      </div>

      {/* Detailed Breakdown */}
      <div className="detailed-breakdown">
        <div className="breakdown-section">
          <h4>Expense Categories</h4>
          <div className="breakdown-list">
            {Object.entries(expensesByCategory)
              .sort(([,a], [,b]) => b - a)
              .map(([category, amount]) => (
                <div key={category} className="breakdown-item">
                  <div className="breakdown-header">
                    <span 
                      className="category-indicator"
                      style={{ backgroundColor: getCategoryColor(category) }}
                    />
                    <span className="category-name">{category}</span>
                  </div>
                  <div className="breakdown-details">
                    <span className="breakdown-amount">{formatCurrency(amount)}</span>
                    <span className="breakdown-percentage">
                      {((amount / totalExpenses) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {incomes.length > 0 && (
          <div className="breakdown-section">
            <h4>Income Sources</h4>
            <div className="breakdown-list">
              {Object.entries(incomesBySource)
                .sort(([,a], [,b]) => b - a)
                .map(([source, amount]) => (
                  <div key={source} className="breakdown-item">
                    <div className="breakdown-header">
                      <span 
                        className="category-indicator"
                        style={{ backgroundColor: getIncomeColor(source) }}
                      />
                      <span className="category-name">{source}</span>
                    </div>
                    <div className="breakdown-details">
                      <span className="breakdown-amount income">{formatCurrency(amount)}</span>
                      <span className="breakdown-percentage">
                        {((amount / totalIncomes) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Category Recommendations */}
      <div className="category-recommendations">
        <h4>Category Recommendations</h4>
        <div className="recommendations-list">
          {((topCategoryAmount / totalExpenses) * 100) > 40 && (
            <div className="recommendation-item warning">
              <span className="rec-icon">⚠️</span>
              <div className="rec-content">
                <span className="rec-title">High Category Concentration</span>
                <span className="rec-message">
                  {topCategory} accounts for {((topCategoryAmount / totalExpenses) * 100).toFixed(1)}% of your expenses. 
                  Consider reviewing this category for potential savings.
                </span>
              </div>
            </div>
          )}

          {Object.keys(expensesByCategory).length < 3 && (
            <div className="recommendation-item info">
              <span className="rec-icon">💡</span>
              <div className="rec-content">
                <span className="rec-title">Limited Categories</span>
                <span className="rec-message">
                  You're using few expense categories. Consider more detailed categorization for better insights.
                </span>
              </div>
            </div>
          )}

          {Object.keys(expensesByCategory).length >= 5 && (
            <div className="recommendation-item success">
              <span className="rec-icon">👍</span>
              <div className="rec-content">
                <span className="rec-title">Good Categorization</span>
                <span className="rec-message">
                  You're tracking expenses across multiple categories. This provides good financial visibility.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryAnalysis;
