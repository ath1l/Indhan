import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import WeightTrendChart from '../components/WeightTrendChart';
import DaysRemainingCard from '../components/DaysRemainingCard';
import CostProjectionCard from '../components/CostProjectionCard';
import AnomalyAlert from '../components/AnomalyAlert';
import './CylinderDetail.css';

export default function CylinderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cylinder, setCylinder] = useState(null);
  const [readings, setReadings] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [anomalies, setAnomalies] = useState([]);
  const [cost, setCost] = useState(null);
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, [id]);

  async function loadAll() {
    setLoading(true);
    try {
      const [cyl, read, pred, anom, costData, usageData] = await Promise.all([
        api.getCylinder(id),
        api.getReadings(id),
        api.getPrediction(id),
        api.getAnomalies(id),
        api.getCost(id),
        api.getUsagePatterns(id),
      ]);
      setCylinder(cyl);
      setReadings(read);
      setPrediction(pred);
      setAnomalies(anom);
      setCost(costData);
      setUsage(usageData);
    } catch (err) {
      console.error('Failed to load cylinder:', err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }

  const handleAcknowledge = async (cylId, anomalyId) => {
    await api.acknowledgeAnomaly(cylId, anomalyId);
  };

  if (loading) {
    return (
      <div className="detail-loading">
        <div className="loading-spinner" />
        <p>Loading cylinder data…</p>
      </div>
    );
  }

  if (!cylinder) return null;

  const pct = prediction
    ? Math.min(100, Math.max(0, (prediction.current_weight_kg / cylinder.capacity_kg) * 100))
    : 0;

  const statusClass = pct < 15 ? 'critical' : pct < 30 ? 'warning' : 'active';

  return (
    <div className="detail-page">
      {/* Header */}
      <header className="detail-header">
        <div className="detail-header-left">
          <Link to="/dashboard" className="back-btn" id="back-to-dashboard">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Dashboard
          </Link>
        </div>
        <div className="detail-header-right">
          <span className={`detail-status status-${statusClass}`}>
            <span className="status-dot-inline" />
            {statusClass === 'active' ? 'Normal' : statusClass === 'warning' ? 'Low' : 'Critical'}
          </span>
        </div>
      </header>

      {/* Cylinder hero */}
      <section className="detail-hero">
        <div className="hero-gauge-section">
          <div className="hero-gauge-wrap">
            <svg viewBox="0 0 120 120" className="hero-gauge-svg">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--gauge-track)" strokeWidth="7" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                strokeWidth="7"
                strokeLinecap="round"
                style={{
                  strokeDasharray: `${(pct / 100) * 327} 327`,
                  stroke:
                    pct > 50 ? 'var(--gauge-full)' : pct > 25 ? 'var(--gauge-mid)' : 'var(--gauge-low)',
                  transform: 'rotate(-90deg)',
                  transformOrigin: '60px 60px',
                  filter: `drop-shadow(0 0 8px ${pct > 50 ? '#22c55e' : pct > 25 ? '#eab308' : '#ef4444'})`,
                  transition: 'stroke-dasharray 1s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              />
            </svg>
            <div className="hero-gauge-center">
              <span className="hero-pct">{Math.round(pct)}%</span>
              <span className="hero-pct-label">Gas Level</span>
            </div>
          </div>
        </div>

        <div className="hero-info">
          <h1 className="hero-name">{cylinder.name}</h1>
          <p className="hero-location">📍 {cylinder.location}</p>
          <div className="hero-meta">
            <div className="meta-chip">
              <span className="meta-label">Capacity</span>
              <span className="meta-value">{cylinder.capacity_kg} kg</span>
            </div>
            <div className="meta-chip">
              <span className="meta-label">ID</span>
              <span className="meta-value mono">{cylinder.id}</span>
            </div>
            <div className="meta-chip">
              <span className="meta-label">Since</span>
              <span className="meta-value">
                {new Date(cylinder.registered_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content grid */}
      <section className="detail-grid">
        {/* Weight chart — spans full width */}
        <div className="detail-chart-col">
          <WeightTrendChart readings={readings} capacity={cylinder.capacity_kg} />
        </div>

        {/* Sidebar cards */}
        <div className="detail-sidebar stagger">
          <DaysRemainingCard prediction={prediction} />
          <CostProjectionCard cost={cost} />
        </div>

        {/* Anomalies — full width */}
        <div className="detail-anomalies-col">
          <AnomalyAlert anomalies={anomalies} onAcknowledge={handleAcknowledge} />
        </div>

        {/* Usage Patterns */}
        {usage && (
          <div className="detail-usage-col">
            <div className="usage-card">
              <h3 className="usage-title">Usage Patterns</h3>
              <div className="usage-grid">
                <div className="usage-item">
                  <span className="usage-icon">⏰</span>
                  <div>
                    <span className="usage-label">Peak Hours</span>
                    <span className="usage-value">{usage.peak_hours.join(', ')}</span>
                  </div>
                </div>
                <div className="usage-item">
                  <span className="usage-icon">📊</span>
                  <div>
                    <span className="usage-label">Avg. Daily Usage</span>
                    <span className="usage-value mono">{usage.avg_daily_usage_kg} kg/day</span>
                  </div>
                </div>
                <div className="usage-item">
                  <span className="usage-icon">🔥</span>
                  <div>
                    <span className="usage-label">Baseline Burn Rate</span>
                    <span className="usage-value mono">{usage.baseline_burn_rate} kg/day</span>
                  </div>
                </div>
                <div className="usage-item">
                  <span className="usage-icon">📈</span>
                  <div>
                    <span className="usage-label">Usage Trend</span>
                    <span className={`usage-value trend-${usage.usage_trend}`}>
                      {usage.usage_trend.charAt(0).toUpperCase() + usage.usage_trend.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
