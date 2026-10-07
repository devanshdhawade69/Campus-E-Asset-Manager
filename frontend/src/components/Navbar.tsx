import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.nav
      className="nav-bar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="nav-brand">
        <Link to="/">♻️ Campus E-Waste Tracker</Link>
      </div>

      <div className="nav-links">
        <Link to="/inventory" className="nav-link">
          Inventory
        </Link>
        <Link to="/add" className="nav-link">
          Add Item
        </Link>
        <Link to="/dashboard" className="nav-link">
          Dashboard
        </Link>
      </div>

      <button className="btn-danger" onClick={handleLogout}>
        Logout
      </button>
    </motion.nav>
  );
};

export default Navbar;
