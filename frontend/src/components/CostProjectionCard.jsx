import './CostProjectionCard.css';

export default function CostProjectionCard({ cost }) {
  if (!cost) return null;

  const { daily_cost, monthly_cost, remaining_value, price_per_kg } = cost;

  return (
    <div className="cost-card">
      <h3 className="cost-card-title">Cost Intelligence</h3>

      <div className="cost-grid">
        <div className="cost-item">
          <span className="cost-icon">📊</span>
          <div className="cost-info">
            <span className="cost-amount">₹{daily_cost.toFixed(0)}</span>
            <span className="cost-period">per day</span>
          </div>
        </div>

        <div className="cost-item highlight">
          <span className="cost-icon">📅</span>
          <div className="cost-info">
            <span className="cost-amount">₹{monthly_cost.toFixed(0)}</span>
            <span className="cost-period">per month</span>
          </div>
        </div>

        <div className="cost-item">
          <span className="cost-icon">⛽</span>
          <div className="cost-info">
            <span className="cost-amount">₹{remaining_value.toFixed(0)}</span>
            <span className="cost-period">remaining</span>
          </div>
        </div>

        <div className="cost-item">
          <span className="cost-icon">💰</span>
          <div className="cost-info">
            <span className="cost-amount">₹{price_per_kg}</span>
            <span className="cost-period">per kg</span>
          </div>
        </div>
      </div>
    </div>
  );
}
