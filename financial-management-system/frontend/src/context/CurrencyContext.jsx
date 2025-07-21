import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getExchangeRates, 
  convertCurrency, 
  SUPPORTED_CURRENCIES,
  refreshExchangeRates 
} from '../services/currencyService';

// Create Currency Context
const CurrencyContext = createContext();

// Custom hook to use Currency Context
export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

// Currency Provider Component
export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Load saved currency preference from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency && SUPPORTED_CURRENCIES[savedCurrency]) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  // Fetch exchange rates when component mounts or currency changes
  useEffect(() => {
    fetchExchangeRates();
  }, []);

  // Save currency preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('selectedCurrency', selectedCurrency);
  }, [selectedCurrency]);

  const fetchExchangeRates = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    
    try {
      let rates;
      if (forceRefresh) {
        rates = await refreshExchangeRates('USD');
      } else {
        rates = await getExchangeRates('USD');
      }
      
      setExchangeRates(rates);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Failed to fetch exchange rates:', err);
      setError('Failed to update exchange rates. Using cached rates.');
    } finally {
      setLoading(false);
    }
  };

  // Convert amount from USD to selected currency
  const convertFromUSD = async (amount) => {
    if (selectedCurrency === 'USD') {
      return amount;
    }
    
    try {
      return await convertCurrency(amount, 'USD', selectedCurrency);
    } catch (error) {
      console.error('Currency conversion failed:', error);
      return amount;
    }
  };

  // Convert amount to USD from selected currency
  const convertToUSD = async (amount) => {
    if (selectedCurrency === 'USD') {
      return amount;
    }
    
    try {
      return await convertCurrency(amount, selectedCurrency, 'USD');
    } catch (error) {
      console.error('Currency conversion failed:', error);
      return amount;
    }
  };

  // Convert amount between any two currencies
  const convertBetweenCurrencies = async (amount, fromCurrency, toCurrency) => {
    try {
      return await convertCurrency(amount, fromCurrency, toCurrency);
    } catch (error) {
      console.error('Currency conversion failed:', error);
      return amount;
    }
  };

  // Get exchange rate for selected currency
  const getSelectedCurrencyRate = () => {
    if (selectedCurrency === 'USD') {
      return 1;
    }
    return exchangeRates[selectedCurrency] || 1;
  };

  // Format currency with current selection
  const formatCurrency = (amount, currency = selectedCurrency) => {
    if (amount === null || amount === undefined) {
      const symbol = SUPPORTED_CURRENCIES[currency]?.symbol || currency;
      return `${symbol}0.00`;
    }

    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch (error) {
      // Fallback if currency is not supported by Intl.NumberFormat
      const symbol = SUPPORTED_CURRENCIES[currency]?.symbol || currency;
      return `${symbol}${amount.toFixed(2)}`;
    }
  };

  // Format currency with conversion from USD
  const formatCurrencyFromUSD = (usdAmount) => {
    if (usdAmount === null || usdAmount === undefined) {
      return formatCurrency(0);
    }

    const rate = getSelectedCurrencyRate();
    const convertedAmount = usdAmount * rate;
    return formatCurrency(convertedAmount);
  };

  // Get currency info
  const getCurrencyInfo = (currencyCode = selectedCurrency) => {
    return SUPPORTED_CURRENCIES[currencyCode] || {
      name: currencyCode,
      symbol: currencyCode,
      flag: '🌍'
    };
  };

  // Change selected currency
  const changeCurrency = (newCurrency) => {
    if (SUPPORTED_CURRENCIES[newCurrency]) {
      setSelectedCurrency(newCurrency);
    } else {
      console.error(`Unsupported currency: ${newCurrency}`);
    }
  };

  // Refresh exchange rates manually
  const refreshRates = () => {
    fetchExchangeRates(true);
  };

  // Check if rates are stale (older than 1 hour)
  const areRatesStale = () => {
    if (!lastUpdated) return true;
    const oneHour = 60 * 60 * 1000;
    return (new Date().getTime() - lastUpdated.getTime()) > oneHour;
  };

  const contextValue = {
    // State
    selectedCurrency,
    exchangeRates,
    loading,
    error,
    lastUpdated,
    
    // Currency info
    supportedCurrencies: SUPPORTED_CURRENCIES,
    getCurrencyInfo,
    
    // Actions
    changeCurrency,
    refreshRates,
    
    // Conversion functions
    convertFromUSD,
    convertToUSD,
    convertBetweenCurrencies,
    getSelectedCurrencyRate,
    
    // Formatting functions
    formatCurrency,
    formatCurrencyFromUSD,
    
    // Utility
    areRatesStale
  };

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
};

export default CurrencyContext;
