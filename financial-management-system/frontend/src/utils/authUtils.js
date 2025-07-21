// Authentication utility functions

export const handleAuthError = (error) => {
  if (error.response?.status === 401) {
    return 'Invalid credentials. Please check your email and password.';
  } else if (error.response?.status === 400) {
    const errorData = error.response.data;
    if (errorData.errors) {
      // Handle validation errors
      return Object.values(errorData.errors).join(', ');
    } else if (errorData.message?.includes('email already exists')) {
      return 'An account with this email already exists. Please try logging in instead.';
    } else {
      return errorData.message || 'Please check your input and try again.';
    }
  } else if (error.response?.status === 500) {
    return 'Server error. Please try again later.';
  } else if (error.code === 'NETWORK_ERROR' || !error.response) {
    return 'Unable to connect to server. Please check your internet connection.';
  } else {
    return error.response?.data?.message || 'An unexpected error occurred. Please try again.';
  }
};

export const validateEmail = (email) => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, text: 'Enter a password' };
  
  let strength = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  strength = Object.values(checks).filter(Boolean).length;
  
  if (strength < 2) return { strength: 1, text: 'Weak', color: '#e74c3c' };
  if (strength < 4) return { strength: 2, text: 'Medium', color: '#f39c12' };
  return { strength: 3, text: 'Strong', color: '#27ae60' };
};

export const formatAuthError = (error) => {
  // Format error for display in UI
  return {
    message: handleAuthError(error),
    type: error.response?.status >= 500 ? 'server' : 'client'
  };
};
