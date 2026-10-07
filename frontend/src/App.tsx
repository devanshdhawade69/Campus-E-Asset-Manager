import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './services/auth';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

function AppContent() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="dark-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      {user && !isAuthPage && <Navbar />}
      <div style={user && !isAuthPage ? { paddingTop: '70px' } : undefined}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><ItemList /></PrivateRoute>} />
          <Route path="/add" element={<PrivateRoute><ItemForm /></PrivateRoute>} />
          <Route path="/edit/:id" element={<PrivateRoute><ItemForm /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
