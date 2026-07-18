import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNotifs, setShowNotifs] = useState(false);
  const user = api.getUser();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [sum, notifs] = await Promise.all([
        api.getDashboardSummary(),
        api.getNotifications(),
      ]);
      setSummary(sum);
      setNotifications(notifs);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = async () => {
    await api.logout();
    navigate('/');
  };

  const unreadNotifs = notifications.filter((n) => !n.read).length;

  // Aggregate stats
  const totalCylinders = summary.length;
  const avgGas = summary.length
    ? Math.round(summary.reduce((a, c) => a + c.gas_percentage, 0) / summary.length)
    : 0;
  const totalAnomalies = summary.reduce((a, c) => a + c.anomalies_count, 0);
  const totalMonthlyCost = summary.reduce((a, c) => a + (c.cost?.monthly_cost || 0), 0);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner" />
        <p>Loading your dashboard…</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* --- Top Bar --- */}
      <header className="dash-header">
        <div className="dash-header-left">
          <div className="dash-logo">
            <svg viewBox="0 0 32 32" width="28" height="28">
              <defs>
                <linearGradient id="fh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#ef4444" />
                </linearGradient>
              </defs>
              <path d="M16 2c0 0-8 8-8 16a8 8 0 0016 0c0-3-1.5-5.5-3-7.5-.5.5-1 2-1 2s-2-3-2-5.5c0-2 1-3.5 1-3.5S17 5 16 2z" fill="url(#fh)" />
              <path d="M16 28a4 4 0 004-4c0-2-2-5-4-7-2 2-4 5-4 7a4 4 0 004 4z" fill="#fbbf24" />
            </svg>
            <span className="dash-brand">Indhan</span>
          </div>
        </div>

        <div className="dash-header-right">
          {/* Notification bell */}
          <button
            className="notif-btn"
            id="notification-bell"
            onClick={() => setShowNotifs(!showNotifs)}
            aria-label="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {unreadNotifs > 0 && <span className="notif-badge">{unreadNotifs}</span>}
          </button>

          {/* User */}
          <div className="dash-user">
            <div className="user-avatar">{user?.name?.charAt(0) || 'U'}</div>
            <span className="user-name">{user?.name || 'User'}</span>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Notification dropdown */}
      {showNotifs && (
        <div className="notif-dropdown" id="notification-panel">
          <div className="notif-dropdown-header">
            <h3>Notifications</h3>
            <button className="notif-close" onClick={() => setShowNotifs(false)}>✕</button>
          </div>
          <div className="notif-list">
            {notifications.map((n) => (
              <div key={n.id} className={`notif-item notif-${n.type} ${n.read ? 'read' : ''}`}>
                <div className="notif-dot" />
                <div className="notif-content">
                  <span className="notif-title">{n.title}</span>
                  <p className="notif-message">{n.message}</p>
                  <span className="notif-time">
                    {new Date(n.created_at).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- Stats Overview --- */}
      <section className="dash-stats stagger">
        <div className="stat-card animate-fade-in-up">
          <div className="stat-icon stat-icon-cylinders">⛽</div>
          <div className="stat-info">
            <span className="stat-value">{totalCylinders}</span>
            <span className="stat-label">Active Cylinders</span>
          </div>
        </div>

        <div className="stat-card animate-fade-in-up">
          <div className="stat-icon stat-icon-gas">
            <svg viewBox="0 0 36 36" width="36" height="36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="var(--gauge-track)" strokeWidth="4" />
              <circle
                cx="18" cy="18" r="14" fill="none"
                stroke={avgGas > 50 ? 'var(--gauge-full)' : avgGas > 25 ? 'var(--gauge-mid)' : 'var(--gauge-low)'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(avgGas / 100) * 88} 88`}
                transform="rotate(-90 18 18)"
              />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{avgGas}%</span>
            <span className="stat-label">Avg. Gas Level</span>
          </div>
        </div>

        <div className="stat-card animate-fade-in-up">
          <div className={`stat-icon stat-icon-anomalies ${totalAnomalies > 0 ? 'has-anomalies' : ''}`}>
            {totalAnomalies > 0 ? '🚨' : '✅'}
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalAnomalies}</span>
            <span className="stat-label">Active Alerts</span>
          </div>
        </div>

        <div className="stat-card animate-fade-in-up">
          <div className="stat-icon stat-icon-cost">💰</div>
          <div className="stat-info">
            <span className="stat-value">₹{totalMonthlyCost.toFixed(0)}</span>
            <span className="stat-label">Monthly Cost</span>
          </div>
        </div>
      </section>

      {/* --- Cylinder Cards --- */}
      <section className="dash-cylinders">
        <h2 className="section-title">Your Cylinders</h2>
        <div className="cylinder-grid stagger">
          {summary.map((cyl) => (
            <Link
              key={cyl.id}
              to={`/cylinder/${cyl.id}`}
              className="cylinder-card animate-fade-in-up"
              id={`cylinder-card-${cyl.id}`}
            >
              {/* Status dot */}
              <div className={`cyl-status-dot status-${cyl.status}`} />

              {/* Gauge */}
              <div className="cyl-gauge-wrap">
                <svg viewBox="0 0 100 100" className="cyl-gauge">
                  <circle cx="50" cy="50" r="42" className="gauge-track" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="gauge-fill"
                    style={{
                      strokeDasharray: `${(cyl.gas_percentage / 100) * 264} 264`,
                      stroke:
                        cyl.gas_percentage > 50
                          ? 'var(--gauge-full)'
                          : cyl.gas_percentage > 25
                          ? 'var(--gauge-mid)'
                          : 'var(--gauge-low)',
                    }}
                  />
                </svg>
                <div className="gauge-center">
                  <span className="gauge-pct">{Math.round(cyl.gas_percentage)}%</span>
                </div>
              </div>

              {/* Info */}
              <div className="cyl-info">
                <h3 className="cyl-name">{cyl.name}</h3>
                <span className="cyl-location">{cyl.location}</span>
              </div>

              {/* Quick stats */}
              <div className="cyl-quick-stats">
                <div className="quick-stat">
                  <span className="qs-value mono">
                    {cyl.prediction.current_weight_kg} kg
                  </span>
                  <span className="qs-label">Weight</span>
                </div>
                <div className="quick-stat">
                  <span className="qs-value mono">
                    {Math.round(cyl.prediction.days_remaining)}d
                  </span>
                  <span className="qs-label">Remaining</span>
                </div>
                <div className="quick-stat">
                  <span className="qs-value">
                    ₹{cyl.cost?.daily_cost?.toFixed(0) || '—'}
                  </span>
                  <span className="qs-label">Daily</span>
                </div>
              </div>

              {/* Anomaly badge */}
              {cyl.anomalies_count > 0 && (
                <div className="cyl-anomaly-badge">
                  {cyl.anomalies_count} alert{cyl.anomalies_count > 1 ? 's' : ''}
                </div>
              )}

              <div className="cyl-arrow">→</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="dash-footer">
        <p>Indhan · Smart LPG Monitoring · Team Bourbon · Hack X '26</p>
      </footer>
    </div>
  );
}
