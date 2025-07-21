import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SimpleExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    console.log('🔄 Loading expenses...');
    setLoading(true);
    setError('');

    try {
      // Get token
      const storedToken = localStorage.getItem('token');
      setToken(storedToken || 'No token');
      
      if (!storedToken) {
        setError('No authentication token found. Please login.');
        setLoading(false);
        return;
      }

      console.log('📡 Making API call...');
      
      // Direct API call
      const response = await axios.get('http://localhost:8080/api/expense', {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('📥 Response received:', response.data);

      if (response.data && response.data.success) {
        setExpenses(response.data.expenses || []);
        console.log(`✅ Loaded ${response.data.expenses?.length || 0} expenses`);
      } else {
        setError('API returned success=false');
      }

    } catch (err) {
      console.error('❌ Error:', err);
      setError(`Error: ${err.message}`);
      
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const doLogin = async () => {
    try {
      console.log('🔐 Attempting login...');
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: 'abcd@gmail.com',
        password: 'password123'
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('✅ Login successful');
        loadExpenses(); // Reload expenses after login
      }
    } catch (err) {
      setError(`Login failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>⏳ Loading Expenses...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>💰 Simple Expenses Page</h1>
      
      {/* Status Info */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '15px', 
        marginBottom: '20px',
        borderRadius: '5px',
        border: '1px solid #dee2e6'
      }}>
        <h3>📊 Status:</h3>
        <p><strong>Token:</strong> {token ? '✅ Present' : '❌ Missing'}</p>
        <p><strong>Expenses Count:</strong> {expenses.length}</p>
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {error || 'None'}</p>
        
        <div style={{ marginTop: '10px' }}>
          <button 
            onClick={doLogin}
            style={{ 
              padding: '10px 15px', 
              marginRight: '10px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔐 Login
          </button>
          
          <button 
            onClick={loadExpenses}
            style={{ 
              padding: '10px 15px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔄 Reload Expenses
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{ 
          background: '#f8d7da', 
          color: '#721c24',
          padding: '15px', 
          marginBottom: '20px',
          borderRadius: '5px',
          border: '1px solid #f5c6cb'
        }}>
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {/* Expenses List */}
      {expenses.length > 0 ? (
        <div>
          <h2>📋 Your Expenses ({expenses.length} total)</h2>
          <div style={{ 
            display: 'grid', 
            gap: '10px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
          }}>
            {expenses.map((expense, index) => (
              <div key={expense.id || index} style={{ 
                background: 'white',
                padding: '15px',
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc3545' }}>
                  ${expense.amount}
                </div>
                <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '5px' }}>
                  {expense.category}
                </div>
                <div style={{ fontSize: '13px', marginBottom: '5px' }}>
                  {expense.description || 'No description'}
                </div>
                <div style={{ fontSize: '12px', color: '#6c757d' }}>
                  {expense.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          background: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h3>📭 No Expenses Found</h3>
          <p>Either you haven't added any expenses yet, or there's an authentication issue.</p>
          <button 
            onClick={doLogin}
            style={{ 
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔐 Try Login Again
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleExpenses;
