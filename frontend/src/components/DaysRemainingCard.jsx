import './DaysRemainingCard.css';

export default function DaysRemainingCard({ prediction }) {
  if (!prediction) return null;

  const { days_remaining, est_empty_at, burn_rate_kg_per_day, confidence, current_weight_kg } = prediction;

  // Ring gauge
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const maxDays = 30;
  const pct = Math.min(1, days_remaining / maxDays);
  const offset = circumference * (1 - pct);
  const color =
    days_remaining > 10 ? 'var(--gauge-full)' : days_remaining > 4 ? 'var(--gauge-mid)' : 'var(--gauge-low)';

  const emptyDate = new Date(est_empty_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="days-remaining-card">
      <div className="days-ring-section">
        <svg className="days-ring" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} className="ring-track" />
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="ring-fill"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              stroke: color,
            }}
          />
        </svg>
        <div className="days-ring-center">
          <span className="days-number">{Math.round(days_remaining)}</span>
          <span className="days-label">days left</span>
        </div>
      </div>

      <div className="days-details">
        <div className="detail-row">
          <span className="detail-label">Current Weight</span>
          <span className="detail-value mono">{current_weight_kg} kg</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Burn Rate</span>
          <span className="detail-value mono">{burn_rate_kg_per_day} kg/day</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Est. Empty</span>
          <span className="detail-value">{emptyDate}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Confidence</span>
          <span className="detail-value">
            <span className="confidence-bar">
              <span className="confidence-fill" style={{ width: `${confidence * 100}%` }} />
            </span>
            {Math.round(confidence * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
