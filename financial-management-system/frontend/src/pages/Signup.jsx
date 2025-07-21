import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import './Auth.css';

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.signup({
        name: data.name,
        email: data.email,
        password: data.password
      });

      if (response.data.success) {
        login(response.data.token, response.data.user);

        // Show success message briefly before redirect
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        setError(response.data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);

      // Handle different types of errors
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.errors) {
          // Handle validation errors
          const errorMessages = Object.values(errorData.errors).join(', ');
          setError(errorMessages);
        } else if (errorData.message?.includes('email already exists')) {
          setError('An account with this email already exists. Please try logging in instead.');
        } else {
          setError(errorData.message || 'Please check your input and try again.');
        }
      } else if (error.code === 'NETWORK_ERROR' || !error.response) {
        setError('Unable to connect to server. Please check your internet connection.');
      } else {
        setError(error.response?.data?.message || 'Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Sign up to start managing your finances</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
              className={errors.name ? 'error' : ''}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <span className="field-error">{errors.name.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className="field-error">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="field-error">{errors.password.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value =>
                  value === watch('password') || 'Passwords do not match'
              })}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword.message}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
