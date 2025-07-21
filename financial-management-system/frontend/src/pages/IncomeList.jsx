import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { incomeAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import IncomeStats from '../components/IncomeStats';
import './IncomeList.css';

const IncomeList = () => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalIncome, setTotalIncome] = useState(0);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    source: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchIncomes();
  }, [filters]);

  const fetchIncomes = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const response = await incomeAPI.getAll(params);

      if (response.data.success) {
        let filteredIncomes = response.data.incomes;

        // Filter by source if specified
        if (filters.source) {
          filteredIncomes = filteredIncomes.filter(income =>
            income.source.toLowerCase().includes(filters.source.toLowerCase())
          );
        }

        setIncomes(filteredIncomes);
        setTotalIncome(response.data.totalIncome || 0);
      } else {
        setError('Failed to load income data');
      }
    } catch (error) {
      console.error('Fetch incomes error:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        setError('Unable to connect to server. Please check your internet connection.');
      } else {
        setError('Failed to load income data. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this income entry?')) {
      return;
    }

    try {
      const response = await incomeAPI.delete(id);
      if (response.data.success) {
        fetchIncomes(); // Refresh the list
      } else {
        setError('Failed to delete income entry');
      }
    } catch (error) {
      console.error('Delete income error:', error);
      setError('Failed to delete income entry');
    }
  };

  const startEdit = (income) => {
    setEditingId(income.id);
    setEditForm({
      amount: income.amount,
      source: income.source,
      date: income.date,
      description: income.description || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    try {
      const response = await incomeAPI.update(editingId, editForm);
      if (response.data.success) {
        setEditingId(null);
        setEditForm({});
        fetchIncomes(); // Refresh the list
      } else {
        setError('Failed to update income entry');
      }
    } catch (error) {
      console.error('Update income error:', error);
      setError('Failed to update income entry');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="page-container">
        <LoadingSpinner size="large" message="Loading your income history..." />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>Income History</h1>
            <p>View and manage your income entries</p>
          </div>
          <Link to="/add-income" className="btn btn-primary">
            + Add Income
          </Link>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchIncomes} className="retry-btn">Retry</button>
        </div>
      )}

      {/* Statistics */}
      {incomes.length > 0 && <IncomeStats incomes={incomes} />}

      {/* Filters */}
      <div className="filters-section">
        <h3>Filters</h3>
        <div className="filters">
          <div className="filter-group">
            <label>Start Date:</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            />
          </div>
          <div className="filter-group">
            <label>End Date:</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            />
          </div>
          <div className="filter-group">
            <label>Source:</label>
            <input
              type="text"
              placeholder="Filter by source..."
              value={filters.source}
              onChange={(e) => setFilters({...filters, source: e.target.value})}
            />
          </div>
          <button
            className="clear-filters-btn"
            onClick={() => setFilters({ startDate: '', endDate: '', source: '' })}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Income List */}
      <div className="income-list">
        {incomes.length === 0 ? (
          <div className="empty-state">
            <p>No income entries found.</p>
            <Link to="/add-income" className="btn btn-primary">
              Add Your First Income
            </Link>
          </div>
        ) : (
          <div className="income-table">
            <div className="table-header">
              <span>Date</span>
              <span>Source</span>
              <span>Amount</span>
              <span>Description</span>
              <span>Actions</span>
            </div>
            {incomes.map(income => (
              <div key={income.id} className="table-row">
                {editingId === income.id ? (
                  // Edit mode
                  <>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                    />
                    <input
                      type="text"
                      value={editForm.source}
                      onChange={(e) => setEditForm({...editForm, source: e.target.value})}
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.amount}
                      onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                    />
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      placeholder="Description..."
                    />
                    <div className="edit-actions">
                      <button onClick={saveEdit} className="save-btn">Save</button>
                      <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
                    </div>
                  </>
                ) : (
                  // View mode
                  <>
                    <span>{formatDate(income.date)}</span>
                    <span className="source-cell">{income.source}</span>
                    <span className="amount-cell">{formatCurrency(income.amount)}</span>
                    <span className="description-cell">{income.description || '-'}</span>
                    <div className="actions-cell">
                      <button
                        onClick={() => startEdit(income)}
                        className="edit-btn"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(income.id)}
                        className="delete-btn"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomeList;
