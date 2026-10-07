import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';
import { motion } from 'framer-motion';

export default function Login() {
  const [emailOrRoll, setEmailOrRoll] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(emailOrRoll, password);
      navigate('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dark-page auth-page">
      <motion.div
        className="glass-card glow-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h1 className="auth-title">♻️ Campus E-Waste Tracker</h1>
        <p className="auth-subtitle">Welcome Back</p>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="form-input"
              type="text"
              name="emailOrRoll"
              placeholder="Email or Roll No"
              value={emailOrRoll}
              onChange={(e) => setEmailOrRoll(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="shimmer-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </motion.div>
    </div>
  );
}
