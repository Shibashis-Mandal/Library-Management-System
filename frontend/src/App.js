import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import AddBookPage from './pages/AddBookPage';
import IssuePage from './pages/IssuePage';
import ReturnPage from './pages/ReturnPage';
import ReportsPage from './pages/ReportsPage';

function App() {
  const [userRole, setUserRole] = useState('');

  const handleLogout = () => {
    setUserRole('');
  };

  // Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    return userRole ? children : <Navigate to="/" replace />;
  };

  // Admin only route wrapper
  const AdminRoute = ({ children }) => {
    if (!userRole) return <Navigate to="/" replace />;
    if (userRole !== 'Admin') return <Navigate to="/dashboard" replace />;
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Navbar userRole={userRole} onLogout={handleLogout} />
        <Routes>
          <Route 
            path="/" 
            element={<HomePage userRole={userRole} setUserRole={setUserRole} />} 
          />
          
          {/* Protected Routes for both Admin and Student */}
          <Route 
            path="/books" 
            element={
              <ProtectedRoute>
                <BooksPage userRole={userRole} />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/dashboard" 
            element={<Navigate to="/books" replace />} 
          />
          
          {/* Admin Only Routes */}
          <Route 
            path="/add-book" 
            element={
              <AdminRoute>
                <AddBookPage />
              </AdminRoute>
            } 
          />
          <Route 
            path="/issue" 
            element={
              <AdminRoute>
                <IssuePage />
              </AdminRoute>
            } 
          />
          <Route 
            path="/return" 
            element={
              <AdminRoute>
                <ReturnPage />
              </AdminRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <AdminRoute>
                <ReportsPage />
              </AdminRoute>
            } 
          />
          


          {/* Catch all - redirect to appropriate page */}
          <Route 
            path="*" 
            element={<Navigate to={userRole ? "/books" : "/"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;