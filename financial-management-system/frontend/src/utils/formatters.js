// Utility functions for formatting data
import { getCurrencySymbol, convertCurrency } from '../services/currencyService';

export const formatCurrency = (amount, currency = 'USD', exchangeRate = 1) => {
  if (amount === null || amount === undefined) return getCurrencySymbol(currency) + '0.00';

  const convertedAmount = amount * exchangeRate;

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(convertedAmount);
  } catch (error) {
    // Fallback if currency is not supported by Intl.NumberFormat
    const symbol = getCurrencySymbol(currency);
    return `${symbol}${convertedAmount.toFixed(2)}`;
  }
};

// Format currency with async conversion
export const formatCurrencyAsync = async (amount, fromCurrency = 'USD', toCurrency = 'USD') => {
  if (amount === null || amount === undefined) return getCurrencySymbol(toCurrency) + '0.00';

  try {
    const convertedAmount = await convertCurrency(amount, fromCurrency, toCurrency);
    return formatCurrency(convertedAmount, toCurrency, 1);
  } catch (error) {
    console.error('Currency formatting failed:', error);
    return formatCurrency(amount, fromCurrency, 1);
  }
};

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  return new Date(dateString).toLocaleDateString('en-US', {
    ...defaultOptions,
    ...options
  });
};

export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toISOString().split('T')[0];
};

export const formatNumber = (number, decimals = 0) => {
  if (number === null || number === undefined) return '0';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  
  return `${value.toFixed(decimals)}%`;
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(dateString);
};

export const getDateRange = (period) => {
  const end = new Date();
  const start = new Date();
  
  switch (period) {
    case 'week':
      start.setDate(end.getDate() - 7);
      break;
    case 'month':
      start.setMonth(end.getMonth() - 1);
      break;
    case 'quarter':
      start.setMonth(end.getMonth() - 3);
      break;
    case 'year':
      start.setFullYear(end.getFullYear() - 1);
      break;
    default:
      start.setDate(end.getDate() - 30);
  }
  
  return {
    start: formatDateForInput(start),
    end: formatDateForInput(end)
  };
};

export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

export const validateDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

export const sortByDate = (items, dateField = 'date', ascending = false) => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a[dateField]);
    const dateB = new Date(b[dateField]);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const groupByMonth = (items, dateField = 'date') => {
  return items.reduce((groups, item) => {
    const monthKey = new Date(item[dateField]).toISOString().slice(0, 7); // YYYY-MM
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(item);
    return groups;
  }, {});
};

export const calculateTotal = (items, amountField = 'amount') => {
  return items.reduce((total, item) => total + parseFloat(item[amountField] || 0), 0);
};
