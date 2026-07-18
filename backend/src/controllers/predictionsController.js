const mlService = require('../services/mlService');
const Reading = require('../models/Reading');

exports.getPrediction = async (req, res) => {
  try {
    const readings = await Reading.find({ cylinder_id: req.params.id });
    if (!readings || readings.length < 2) {
      return res.status(200).json({ prediction: null, message: "Not enough data for prediction" });
    }
    const prediction = await mlService.getPrediction(req.params.id);
    res.status(200).json(prediction);
  } catch (error) {
    console.error(`Prediction Error:`, error.message);
    res.status(500).json({ message: "Prediction failed safely" });
  }
};

exports.getPredictionHistory = async (req, res) => {
  try {
    const { startDate } = req.query;
    let query = { cylinder_id: req.params.id };
    if (startDate) query.timestamp = { $gte: new Date(startDate) };
    
    const readings = await Reading.find(query);
    if (!readings || readings.length < 2) {
      return res.status(200).json([]);
    }
    const history = await mlService.getPredictionHistory(req.params.id, { startDate });
    res.status(200).json(history);
  } catch (error) {
    console.error(`History Error:`, error.message);
    res.status(500).json({ message: "History fetch failed safely" });
  }
};
