import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { expenseAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AddExpense = () => {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [customCategory, setCustomCategory] = useState(false);

  const commonCategories = [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Home & Garden',
    'Personal Care',
    'Insurance',
    'Taxes',
    'Business',
    'Gifts & Donations',
    'Other'
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await expenseAPI.create(data);

      if (response.data.success) {
        setSuccess('Expense added successfully! Redirecting...');
        reset();
        setTimeout(() => {
          navigate('/expenses');
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to add expense');
      }
    } catch (error) {
      console.error('Add expense error:', error);

      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const errorMessages = Object.values(errorData.errors).join(', ');
          setError(errorMessages);
        } else {
          setError(errorData.message || 'Please check your input and try again.');
        }
      } else if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        setError('Unable to connect to server. Please check your internet connection.');
      } else {
        setError(error.response?.data?.message || 'Failed to add expense. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Add Expense</h1>
        <p>Record a new expense entry</p>
      </div>

      <div className="form-container">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-group">
            <label htmlFor="amount">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              id="amount"
              {...register('amount', {
                required: 'Amount is required',
                min: { value: 0.01, message: 'Amount must be greater than 0' }
              })}
              className={errors.amount ? 'error' : ''}
              placeholder="0.00"
            />
            {errors.amount && (
              <span className="field-error">{errors.amount.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            {!customCategory ? (
              <div className="category-selection">
                <select
                  id="category"
                  {...register('category', {
                    required: 'Category is required'
                  })}
                  className={errors.category ? 'error' : ''}
                  onChange={(e) => {
                    if (e.target.value === 'Other') {
                      setCustomCategory(true);
                      setValue('category', '');
                    }
                  }}
                >
                  <option value="">Select expense category</option>
                  {commonCategories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="custom-category-btn"
                  onClick={() => {
                    setCustomCategory(true);
                    setValue('category', '');
                  }}
                >
                  Custom Category
                </button>
              </div>
            ) : (
              <div className="custom-category-input">
                <input
                  type="text"
                  id="category"
                  {...register('category', {
                    required: 'Category is required',
                    maxLength: { value: 50, message: 'Category must not exceed 50 characters' }
                  })}
                  className={errors.category ? 'error' : ''}
                  placeholder="Enter custom category"
                />
                <button
                  type="button"
                  className="back-to-select-btn"
                  onClick={() => {
                    setCustomCategory(false);
                    setValue('category', '');
                  }}
                >
                  Back to List
                </button>
              </div>
            )}
            {errors.category && (
              <span className="field-error">{errors.category.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              {...register('date', {
                required: 'Date is required'
              })}
              className={errors.date ? 'error' : ''}
              defaultValue={new Date().toISOString().split('T')[0]}
            />
            {errors.date && (
              <span className="field-error">{errors.date.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              {...register('description', {
                maxLength: { value: 500, message: 'Description must not exceed 500 characters' }
              })}
              className={errors.description ? 'error' : ''}
              placeholder="What did you spend on? (optional)"
              rows="3"
            />
            {errors.description && (
              <span className="field-error">{errors.description.message}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/expenses')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
