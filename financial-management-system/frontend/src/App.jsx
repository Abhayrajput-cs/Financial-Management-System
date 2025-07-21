import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { ToastContainer } from './components/Toast';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddIncome from './pages/AddIncome';
import AddExpense from './pages/AddExpense';
import IncomeList from './pages/IncomeList';
import ExpenseList from './pages/ExpenseList';
import DebugExpenses from './pages/DebugExpenses';
import SimpleExpenseTest from './pages/SimpleExpenseTest';
import SimpleExpenses from './pages/SimpleExpenses';
import Analytics from './pages/Analytics';
import useToast from './utils/useToast';
import './App.css';

function App() {
  const { toasts, removeToast } = useToast();

  return (
    <AuthProvider>
      <CurrencyProvider>
        <Router>
          <div className="App">
            <Navbar />
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Protected Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />

                <Route path="/add-income" element={
                  <ProtectedRoute>
                    <AddIncome />
                  </ProtectedRoute>
                } />

                <Route path="/add-expense" element={
                  <ProtectedRoute>
                    <AddExpense />
                  </ProtectedRoute>
                } />

                <Route path="/income" element={
                  <ProtectedRoute>
                    <IncomeList />
                  </ProtectedRoute>
                } />

                <Route path="/expenses" element={
                  <ProtectedRoute>
                    <ExpenseList />
                  </ProtectedRoute>
                } />

                <Route path="/debug-expenses" element={
                  <ProtectedRoute>
                    <DebugExpenses />
                  </ProtectedRoute>
                } />

                <Route path="/test-expenses" element={
                  <ProtectedRoute>
                    <SimpleExpenseTest />
                  </ProtectedRoute>
                } />

                <Route path="/simple-expenses" element={<SimpleExpenses />} />

                <Route path="/analytics" element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } />

                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </main>

            {/* Toast notifications */}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
          </div>
        </Router>
      </CurrencyProvider>
    </AuthProvider>
  );
}

export default App;
