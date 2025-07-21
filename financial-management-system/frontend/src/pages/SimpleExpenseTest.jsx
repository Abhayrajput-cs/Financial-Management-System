import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SimpleExpenseTest = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testAPI = async () => {
    setLoading(true);
    setError('');
    setData(null);

    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);

      if (!token) {
        setError('No token found. Please login first.');
        setLoading(false);
        return;
      }

      console.log('Making direct API call...');
      const response = await axios.get('http://localhost:8080/api/expense', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response:', response);
      setData(response.data);

    } catch (err) {
      console.error('Error:', err);
      setError(`Error: ${err.message} - ${err.response?.status} - ${JSON.stringify(err.response?.data)}`);
    } finally {
      setLoading(false);
    }
  };

  const loginTest = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: 'abcd@gmail.com',
        password: 'password123'
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setError('Login successful! Now try fetching expenses.');
      }
    } catch (err) {
      setError(`Login failed: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🧪 Simple Expense API Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={loginTest}
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
          🔐 Login First
        </button>
        
        <button 
          onClick={testAPI}
          disabled={loading}
          style={{ 
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {loading ? '⏳ Testing...' : '🧪 Test Expenses API'}
        </button>
      </div>

      {error && (
        <div style={{ 
          background: '#f8d7da', 
          color: '#721c24',
          padding: '10px', 
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {data && (
        <div style={{ 
          background: '#d4edda', 
          color: '#155724',
          padding: '15px', 
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          <h3>✅ API Response:</h3>
          <p><strong>Success:</strong> {data.success ? 'Yes' : 'No'}</p>
          <p><strong>Count:</strong> {data.count}</p>
          <p><strong>Total Expense:</strong> ${data.totalExpense}</p>
          <p><strong>Expenses Found:</strong> {data.expenses?.length || 0}</p>
          
          {data.expenses && data.expenses.length > 0 && (
            <div>
              <h4>First 3 Expenses:</h4>
              {data.expenses.slice(0, 3).map((expense, index) => (
                <div key={index} style={{ 
                  background: 'white', 
                  padding: '8px', 
                  margin: '5px 0',
                  borderRadius: '3px'
                }}>
                  <strong>${expense.amount}</strong> - {expense.category} - {expense.description} ({expense.date})
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ 
        background: '#f8f9fa', 
        padding: '15px', 
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <h4>Current Status:</h4>
        <p><strong>Token:</strong> {localStorage.getItem('token') ? '✅ Present' : '❌ Missing'}</p>
        <p><strong>User:</strong> {localStorage.getItem('user') || '❌ Not logged in'}</p>
        <p><strong>Backend URL:</strong> http://localhost:8080/api</p>
      </div>
    </div>
  );
};

export default SimpleExpenseTest;
