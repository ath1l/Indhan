const mlService = require('../services/mlService');

exports.getAnomalies = async (req, res) => {
  try {
    const anomalies = await mlService.getAnomalies(req.params.id);
    res.status(200).json(anomalies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAnomaly = async (req, res) => {
  try {
    const anomaly = await mlService.getAnomaly(req.params.id, req.params.anomalyId);
    res.status(200).json(anomaly);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.acknowledgeAnomaly = async (req, res) => {
  try {
    // In a real app, update the anomaly record in DB
    res.status(200).json({ message: "Anomaly acknowledged", id: req.params.anomalyId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
