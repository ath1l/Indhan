import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await api.register(form.name, form.email, form.password);
      } else {
        await api.login(form.email, form.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    try {
      await api.login('hari@indhan.io', 'demo123');
      navigate('/dashboard');
    } catch {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Animated background */}
      <div className="login-bg">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <div className="login-container">
        {/* Brand */}
        <div className="login-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 32 32" width="48" height="48">
              <defs>
                <linearGradient id="flame" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <path
                d="M16 2c0 0-8 8-8 16a8 8 0 0016 0c0-3-1.5-5.5-3-7.5-.5.5-1 2-1 2s-2-3-2-5.5c0-2 1-3.5 1-3.5S17 5 16 2z"
                fill="url(#flame)"
              />
              <path
                d="M16 28a4 4 0 004-4c0-2-2-5-4-7-2 2-4 5-4 7a4 4 0 004 4z"
                fill="#fbbf24"
              />
            </svg>
          </div>
          <h1 className="brand-name">Indhan</h1>
          <p className="brand-tagline">Smart LPG Cylinder Monitoring</p>
        </div>

        {/* Form Card */}
        <div className="login-card">
          <h2 className="login-heading">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>

          <form onSubmit={handleSubmit} className="login-form">
            {isRegister && (
              <div className="form-group">
                <label htmlFor="login-name">Full Name</label>
                <input
                  id="login-name"
                  type="text"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="login-spinner" />
              ) : isRegister ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>or</span>
          </div>

          <button className="login-demo" onClick={handleDemo} disabled={loading}>
            🚀 Try Demo Account
          </button>

          <p className="login-switch">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}
            <button
              type="button"
              className="login-switch-btn"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
            >
              {isRegister ? 'Sign In' : 'Register'}
            </button>
          </p>
        </div>

        <p className="login-footer">Team Bourbon · Hack X '26</p>
      </div>
    </div>
  );
}
