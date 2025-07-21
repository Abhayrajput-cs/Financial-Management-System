import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { incomeAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AddIncome = () => {
  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [customSource, setCustomSource] = useState(false);

  const commonSources = [
    'Salary',
    'Freelance',
    'Investment',
    'Business',
    'Rental Income',
    'Bonus',
    'Commission',
    'Gift',
    'Other'
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await incomeAPI.create(data);

      if (response.data.success) {
        setSuccess('Income added successfully! Redirecting...');
        reset();
        setTimeout(() => {
          navigate('/income');
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to add income');
      }
    } catch (error) {
      console.error('Add income error:', error);

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
        setError(error.response?.data?.message || 'Failed to add income. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Add Income</h1>
        <p>Record a new income entry</p>
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
            <label htmlFor="source">Income Source</label>
            {!customSource ? (
              <div className="source-selection">
                <select
                  id="source"
                  {...register('source', {
                    required: 'Source is required'
                  })}
                  className={errors.source ? 'error' : ''}
                  onChange={(e) => {
                    if (e.target.value === 'Other') {
                      setCustomSource(true);
                      setValue('source', '');
                    }
                  }}
                >
                  <option value="">Select income source</option>
                  {commonSources.map(source => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
                <button
                  type="button"
                  className="custom-source-btn"
                  onClick={() => {
                    setCustomSource(true);
                    setValue('source', '');
                  }}
                >
                  Custom Source
                </button>
              </div>
            ) : (
              <div className="custom-source-input">
                <input
                  type="text"
                  id="source"
                  {...register('source', {
                    required: 'Source is required',
                    maxLength: { value: 100, message: 'Source must not exceed 100 characters' }
                  })}
                  className={errors.source ? 'error' : ''}
                  placeholder="Enter custom income source"
                />
                <button
                  type="button"
                  className="back-to-select-btn"
                  onClick={() => {
                    setCustomSource(false);
                    setValue('source', '');
                  }}
                >
                  Back to List
                </button>
              </div>
            )}
            {errors.source && (
              <span className="field-error">{errors.source.message}</span>
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
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              {...register('description', {
                maxLength: { value: 500, message: 'Description must not exceed 500 characters' }
              })}
              className={errors.description ? 'error' : ''}
              placeholder="Additional details about this income..."
              rows="3"
            />
            {errors.description && (
              <span className="field-error">{errors.description.message}</span>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/income')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIncome;
