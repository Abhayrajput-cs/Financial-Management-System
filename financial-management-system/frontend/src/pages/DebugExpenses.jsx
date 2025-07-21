import React, { useState } from 'react';
import { expenseAPI } from '../services/api';

const DebugExpenses = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      // Check token
      const token = localStorage.getItem('token');
      setResult(prev => prev + `\nToken exists: ${token ? 'YES' : 'NO'}`);
      
      if (!token) {
        setResult(prev => prev + '\nPlease login first!');
        setLoading(false);
        return;
      }

      // Test API call
      setResult(prev => prev + '\nMaking API call...');
      const response = await expenseAPI.getAll();
      setResult(prev => prev + `\nAPI Response: ${JSON.stringify(response.data, null, 2)}`);
      
    } catch (error) {
      setResult(prev => prev + `\nError: ${error.message}`);
      setResult(prev => prev + `\nError details: ${JSON.stringify(error.response?.data, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const clearStorage = () => {
    localStorage.clear();
    setResult('Local storage cleared. Please login again.');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Debug Expenses API</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={testAPI} disabled={loading}>
          Test Expenses API
        </button>
        <button onClick={clearStorage} style={{ marginLeft: '10px' }}>
          Clear Storage
        </button>
      </div>

      <div style={{ 
        background: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '5px',
        whiteSpace: 'pre-wrap',
        minHeight: '200px'
      }}>
        {result || 'Click "Test Expenses API" to debug...'}
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Current Local Storage:</h3>
        <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
          <strong>Token:</strong> {localStorage.getItem('token') ? 'EXISTS' : 'NOT FOUND'}<br/>
          <strong>User:</strong> {localStorage.getItem('user') || 'NOT FOUND'}
        </div>
      </div>
    </div>
  );
};

export default DebugExpenses;
