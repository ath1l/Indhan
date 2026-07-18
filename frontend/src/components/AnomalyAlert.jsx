import { useState } from 'react';
import './AnomalyAlert.css';

export default function AnomalyAlert({ anomalies = [], onAcknowledge }) {
  const [dismissedIds, setDismissedIds] = useState(new Set());

  const active = anomalies.filter(
    (a) => !a.acknowledged && !dismissedIds.has(a.id)
  );

  if (active.length === 0) {
    return (
      <div className="anomaly-card anomaly-empty">
        <div className="anomaly-empty-icon">✅</div>
        <p className="anomaly-empty-text">No active anomalies</p>
        <p className="anomaly-empty-sub">All systems operating normally</p>
      </div>
    );
  }

  const handleDismiss = (anomaly) => {
    setDismissedIds((prev) => new Set(prev).add(anomaly.id));
    if (onAcknowledge) {
      onAcknowledge(anomaly.cylinder_id, anomaly.id);
    }
  };

  const severityIcon = {
    critical: '🚨',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div className="anomaly-card">
      <div className="anomaly-header">
        <h3 className="anomaly-title">Anomaly Alerts</h3>
        <span className="anomaly-count">{active.length}</span>
      </div>
      <div className="anomaly-list">
        {active.map((anomaly) => (
          <div key={anomaly.id} className={`anomaly-item severity-${anomaly.severity}`}>
            <div className="anomaly-item-header">
              <span className="anomaly-severity-icon">
                {severityIcon[anomaly.severity] || '❓'}
              </span>
              <span className="anomaly-type">{anomaly.type.replace('_', ' ')}</span>
              <span className={`anomaly-badge ${anomaly.severity}`}>{anomaly.severity}</span>
            </div>
            <p className="anomaly-message">{anomaly.message}</p>
            <div className="anomaly-footer">
              <span className="anomaly-time">
                {new Date(anomaly.detected_at).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <button
                className="anomaly-dismiss-btn"
                onClick={() => handleDismiss(anomaly)}
              >
                Acknowledge
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
