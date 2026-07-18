/**
 * Mock Service for ML Engine outputs
 * These functions simulate calls to the ML team's APIs or data stores.
 */

const getPrediction = async (cylinderId) => {
  // Mock data matching API contract
  return {
    cylinder_id: cylinderId,
    current_weight_kg: 5.26,
    days_remaining: 6.2,
    est_empty_at: "2026-07-24T18:00:00Z",
    burn_rate_kg_per_day: 0.21,
    confidence: 0.87
  };
};

const getPredictionHistory = async (cylinderId) => {
  return [
    { date: "2026-07-16", days_remaining: 8.0, burn_rate_kg_per_day: 0.20 },
    { date: "2026-07-17", days_remaining: 7.1, burn_rate_kg_per_day: 0.21 },
    { date: "2026-07-18", days_remaining: 6.2, burn_rate_kg_per_day: 0.21 },
  ];
};

const getAnomalies = async (cylinderId) => {
  return [
    {
      id: "anom_001",
      cylinder_id: cylinderId,
      type: "spike",
      detected_at: "2026-07-17T10:00:00Z",
      description: "Sudden weight increase detected (possible refill or tampering)",
      severity: "low",
      acknowledged: false
    }
  ];
};

const getAnomaly = async (cylinderId, anomalyId) => {
  return {
    id: anomalyId,
    cylinder_id: cylinderId,
    type: "spike",
    detected_at: "2026-07-17T10:00:00Z",
    description: "Sudden weight increase detected (possible refill or tampering)",
    severity: "low",
    acknowledged: false
  };
};

const getUsagePatterns = async (cylinderId) => {
  return {
    peak_hours: ["07:00", "08:00", "19:00", "20:00"],
    baseline_burn_rate_kg_per_day: 0.2
  };
};

module.exports = {
  getPrediction,
  getPredictionHistory,
  getAnomalies,
  getAnomaly,
  getUsagePatterns
};
