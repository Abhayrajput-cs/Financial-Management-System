import React, { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import './CurrencySelector.css';

const CurrencySelector = ({ className = '', showLabel = true, compact = false }) => {
  const {
    selectedCurrency,
    supportedCurrencies,
    changeCurrency,
    getCurrencyInfo,
    loading,
    error,
    lastUpdated,
    refreshRates,
    areRatesStale
  } = useCurrency();

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const currentCurrencyInfo = getCurrencyInfo(selectedCurrency);

  // Filter currencies based on search term
  const filteredCurrencies = Object.entries(supportedCurrencies).filter(([code, info]) =>
    code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    info.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCurrencySelect = (currencyCode) => {
    changeCurrency(currencyCode);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleRefresh = (e) => {
    e.stopPropagation();
    refreshRates();
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return 'Never updated';
    
    const now = new Date();
    const diffInMinutes = Math.floor((now - lastUpdated) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just updated';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (compact) {
    return (
      <div className={`currency-selector compact ${className}`}>
        <button
          className="currency-button compact"
          onClick={() => setIsOpen(!isOpen)}
          disabled={loading}
        >
          <span className="currency-flag">{currentCurrencyInfo.flag}</span>
          <span className="currency-code">{selectedCurrency}</span>
          <span className="dropdown-arrow">▼</span>
        </button>
        
        {isOpen && (
          <div className="currency-dropdown">
            <div className="dropdown-header">
              <input
                type="text"
                placeholder="Search currencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="currency-search"
                autoFocus
              />
            </div>
            
            <div className="currency-list">
              {filteredCurrencies.map(([code, info]) => (
                <button
                  key={code}
                  className={`currency-option ${code === selectedCurrency ? 'selected' : ''}`}
                  onClick={() => handleCurrencySelect(code)}
                >
                  <span className="currency-flag">{info.flag}</span>
                  <span className="currency-details">
                    <span className="currency-code">{code}</span>
                    <span className="currency-name">{info.name}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`currency-selector ${className}`}>
      {showLabel && (
        <label className="currency-label">
          Currency Display
        </label>
      )}
      
      <div className="currency-selector-container">
        <button
          className={`currency-button ${isOpen ? 'open' : ''} ${loading ? 'loading' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          disabled={loading}
        >
          <div className="currency-display">
            <span className="currency-flag">{currentCurrencyInfo.flag}</span>
            <div className="currency-info">
              <span className="currency-code">{selectedCurrency}</span>
              <span className="currency-name">{currentCurrencyInfo.name}</span>
            </div>
          </div>
          <div className="currency-actions">
            {areRatesStale() && (
              <span className="stale-indicator" title="Exchange rates may be outdated">
                ⚠️
              </span>
            )}
            <button
              className="refresh-button"
              onClick={handleRefresh}
              disabled={loading}
              title="Refresh exchange rates"
            >
              {loading ? '🔄' : '↻'}
            </button>
            <span className="dropdown-arrow">▼</span>
          </div>
        </button>

        {isOpen && (
          <div className="currency-dropdown">
            <div className="dropdown-header">
              <input
                type="text"
                placeholder="Search currencies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="currency-search"
                autoFocus
              />
              <div className="rate-info">
                <span className="last-updated">
                  Updated: {formatLastUpdated()}
                </span>
                {error && (
                  <span className="error-indicator" title={error}>
                    ⚠️ {error}
                  </span>
                )}
              </div>
            </div>
            
            <div className="currency-list">
              {filteredCurrencies.length > 0 ? (
                filteredCurrencies.map(([code, info]) => (
                  <button
                    key={code}
                    className={`currency-option ${code === selectedCurrency ? 'selected' : ''}`}
                    onClick={() => handleCurrencySelect(code)}
                  >
                    <span className="currency-flag">{info.flag}</span>
                    <div className="currency-details">
                      <div className="currency-main">
                        <span className="currency-code">{code}</span>
                        <span className="currency-symbol">{info.symbol}</span>
                      </div>
                      <span className="currency-name">{info.name}</span>
                    </div>
                    {code === selectedCurrency && (
                      <span className="selected-indicator">✓</span>
                    )}
                  </button>
                ))
              ) : (
                <div className="no-results">
                  No currencies found matching "{searchTerm}"
                </div>
              )}
            </div>
            
            <div className="dropdown-footer">
              <small>
                Exchange rates are updated every 30 minutes
              </small>
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className="currency-overlay" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CurrencySelector;
