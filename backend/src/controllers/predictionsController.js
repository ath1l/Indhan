const mlService = require('../services/mlService');

exports.getPrediction = async (req, res) => {
  try {
    const prediction = await mlService.getPrediction(req.params.id);
    res.status(200).json(prediction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPredictionHistory = async (req, res) => {
  try {
    const history = await mlService.getPredictionHistory(req.params.id);
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
