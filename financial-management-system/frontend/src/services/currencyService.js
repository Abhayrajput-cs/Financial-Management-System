import axios from 'axios';

// Free exchange rate API - no API key required for basic usage
const EXCHANGE_RATE_API_URL = 'https://api.exchangerate-api.com/v4/latest';

// Fallback API in case the primary one fails
const FALLBACK_API_URL = 'https://api.fxratesapi.com/latest';

// Cache for exchange rates to avoid too many API calls
let exchangeRateCache = {
  rates: {},
  lastUpdated: null,
  baseCurrency: 'USD'
};

// Cache duration in milliseconds (30 minutes)
const CACHE_DURATION = 30 * 60 * 1000;

// Supported currencies with their display names
export const SUPPORTED_CURRENCIES = {
  'USD': { name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  'EUR': { name: 'Euro', symbol: '€', flag: '🇪🇺' },
  'GBP': { name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  'JPY': { name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  'INR': { name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  'CAD': { name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  'AUD': { name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  'CHF': { name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭' },
  'CNY': { name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  'SEK': { name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
  'NZD': { name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
  'MXN': { name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
  'SGD': { name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
  'HKD': { name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
  'NOK': { name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
  'TRY': { name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
  'RUB': { name: 'Russian Ruble', symbol: '₽', flag: '🇷🇺' },
  'BRL': { name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
  'ZAR': { name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
  'KRW': { name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
  'THB': { name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
  'PLN': { name: 'Polish Zloty', symbol: 'zł', flag: '🇵🇱' },
  'CZK': { name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿' },
  'HUF': { name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺' }
};

// Check if cache is still valid
const isCacheValid = () => {
  if (!exchangeRateCache.lastUpdated) return false;
  const now = new Date().getTime();
  return (now - exchangeRateCache.lastUpdated) < CACHE_DURATION;
};

// Fetch exchange rates from API
const fetchExchangeRates = async (baseCurrency = 'USD') => {
  try {
    // Try primary API first
    let response;
    try {
      response = await axios.get(`${EXCHANGE_RATE_API_URL}/${baseCurrency}`, {
        timeout: 5000
      });
    } catch (error) {
      console.warn('Primary exchange rate API failed, trying fallback...', error.message);
      // Try fallback API
      response = await axios.get(`${FALLBACK_API_URL}`, {
        params: { base: baseCurrency },
        timeout: 5000
      });
    }

    if (response.data && response.data.rates) {
      // Update cache
      exchangeRateCache = {
        rates: response.data.rates,
        lastUpdated: new Date().getTime(),
        baseCurrency: baseCurrency
      };
      
      // Save to localStorage for offline access
      localStorage.setItem('exchangeRateCache', JSON.stringify(exchangeRateCache));
      
      return response.data.rates;
    } else {
      throw new Error('Invalid response format from exchange rate API');
    }
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error);
    
    // Try to load from localStorage as fallback
    const cachedData = localStorage.getItem('exchangeRateCache');
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        exchangeRateCache = parsed;
        console.warn('Using cached exchange rates due to API failure');
        return parsed.rates;
      } catch (parseError) {
        console.error('Failed to parse cached exchange rates:', parseError);
      }
    }
    
    // Return default rates if all else fails
    console.warn('Using default exchange rates due to API and cache failure');
    return getDefaultRates();
  }
};

// Get default exchange rates (approximate values for fallback)
const getDefaultRates = () => {
  return {
    'USD': 1,
    'EUR': 0.85,
    'GBP': 0.73,
    'JPY': 110,
    'INR': 84.34,
    'CAD': 1.25,
    'AUD': 1.35,
    'CHF': 0.92,
    'CNY': 7.1,
    'SEK': 8.5,
    'NZD': 1.45,
    'MXN': 20.5,
    'SGD': 1.35,
    'HKD': 7.8,
    'NOK': 8.8,
    'TRY': 27.5,
    'RUB': 75,
    'BRL': 5.2,
    'ZAR': 15.5,
    'KRW': 1200,
    'THB': 33,
    'PLN': 4.1,
    'CZK': 22,
    'HUF': 350
  };
};

// Get exchange rates (with caching)
export const getExchangeRates = async (baseCurrency = 'USD') => {
  // Check if we have valid cached data for the same base currency
  if (isCacheValid() && exchangeRateCache.baseCurrency === baseCurrency) {
    return exchangeRateCache.rates;
  }
  
  // Fetch fresh data
  return await fetchExchangeRates(baseCurrency);
};

// Convert amount from one currency to another
export const convertCurrency = async (amount, fromCurrency = 'USD', toCurrency = 'USD') => {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  try {
    const rates = await getExchangeRates('USD'); // Always use USD as base for consistency
    
    // Convert to USD first if fromCurrency is not USD
    let usdAmount = amount;
    if (fromCurrency !== 'USD') {
      const fromRate = rates[fromCurrency];
      if (!fromRate) {
        throw new Error(`Exchange rate not found for ${fromCurrency}`);
      }
      usdAmount = amount / fromRate;
    }
    
    // Convert from USD to target currency
    if (toCurrency === 'USD') {
      return usdAmount;
    }
    
    const toRate = rates[toCurrency];
    if (!toRate) {
      throw new Error(`Exchange rate not found for ${toCurrency}`);
    }
    
    return usdAmount * toRate;
  } catch (error) {
    console.error('Currency conversion failed:', error);
    // Return original amount if conversion fails
    return amount;
  }
};

// Get exchange rate between two currencies
export const getExchangeRate = async (fromCurrency = 'USD', toCurrency = 'USD') => {
  if (fromCurrency === toCurrency) {
    return 1;
  }
  
  try {
    const convertedAmount = await convertCurrency(1, fromCurrency, toCurrency);
    return convertedAmount;
  } catch (error) {
    console.error('Failed to get exchange rate:', error);
    return 1;
  }
};

// Get currency symbol
export const getCurrencySymbol = (currencyCode) => {
  return SUPPORTED_CURRENCIES[currencyCode]?.symbol || currencyCode;
};

// Get currency display name
export const getCurrencyName = (currencyCode) => {
  return SUPPORTED_CURRENCIES[currencyCode]?.name || currencyCode;
};

// Get currency flag emoji
export const getCurrencyFlag = (currencyCode) => {
  return SUPPORTED_CURRENCIES[currencyCode]?.flag || '🌍';
};

// Initialize cache from localStorage on module load
const initializeCache = () => {
  try {
    const cachedData = localStorage.getItem('exchangeRateCache');
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      if (parsed.rates && parsed.lastUpdated) {
        exchangeRateCache = parsed;
      }
    }
  } catch (error) {
    console.error('Failed to initialize exchange rate cache:', error);
  }
};

// Initialize cache when module loads
initializeCache();

// Export cache for debugging purposes
export const getCache = () => exchangeRateCache;

// Force refresh cache
export const refreshExchangeRates = async (baseCurrency = 'USD') => {
  exchangeRateCache.lastUpdated = null; // Invalidate cache
  return await fetchExchangeRates(baseCurrency);
};
