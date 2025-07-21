import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Income API
export const incomeAPI = {
  create: (incomeData) => api.post('/income', incomeData),
  getAll: (params = {}) => api.get('/income', { params }),
  getById: (id) => api.get(`/income/${id}`),
  update: (id, incomeData) => api.put(`/income/${id}`, incomeData),
  delete: (id) => api.delete(`/income/${id}`),
};

// Expense API
export const expenseAPI = {
  create: (expenseData) => api.post('/expense', expenseData),
  getAll: (params = {}) => api.get('/expense', { params }),
  getById: (id) => api.get(`/expense/${id}`),
  update: (id, expenseData) => api.put(`/expense/${id}`, expenseData),
  delete: (id) => api.delete(`/expense/${id}`),
  getCategories: () => api.get('/expense/categories'),
};

// Analytics API
export const analyticsAPI = {
  getOverallSummary: () => api.get('/analytics/overall-summary'),
  getCategoryBreakdown: () => api.get('/analytics/category-breakdown'),
  getMonthlySummary: (year) => api.get('/analytics/monthly-summary', { params: { year } }),
  getRecentSummary: (days) => api.get('/analytics/recent-summary', { params: { days } }),
  getIncomeVsExpensesTrend: (months) => api.get('/analytics/income-vs-expenses-trend', { params: { months } }),
  getDashboardData: () => api.get('/analytics/dashboard'),
};

export default api;
