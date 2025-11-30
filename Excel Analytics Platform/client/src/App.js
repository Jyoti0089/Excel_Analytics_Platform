import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import Upload from './components/Upload/Upload';
import Analyze from './components/Analyze/Analyze';
import History from './components/History/History';
import AdminPanel from './components/Admin/AdminPanel';
import LoadingSpinner from './components/UI/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          {user && <Navbar />}
          <main className={user ? 'pt-0' : ''}>
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={!user ? <Login /> : <Navigate to="/dashboard" replace />} 
              />
              <Route 
                path="/register" 
                element={!user ? <Register /> : <Navigate to="/dashboard" replace />} 
              />
              
              {/* Protected Routes */}
              <Route 
                path="/dashboard" 
                element={user ? <Dashboard /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/upload" 
                element={user ? <Upload /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/analyze/:uploadId?" 
                element={user ? <Analyze /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/history" 
                element={user ? <History /> : <Navigate to="/login" replace />} 
              />
              
              {/* Admin Route */}
              <Route 
                path="/admin" 
                element={user?.isAdmin ? <AdminPanel /> : <Navigate to="/dashboard" replace />} 
              />
              
              {/* Default Route */}
              <Route 
                path="/" 
                element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
              />
              
              {/* 404 Route */}
              <Route 
                path="*" 
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                      <p className="text-gray-600 mb-8">Page not found</p>
                      <Navigate to={user ? "/dashboard" : "/login"} replace />
                    </div>
                  </div>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
