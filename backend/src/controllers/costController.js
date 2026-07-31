const mlService = require('../services/mlService');
const Reading = require('../models/Reading');
const PRICING = require('../config/pricing');

exports.getCostProjection = async (req, res) => {
  try {
    const readings = await Reading.find({ cylinder_id: req.params.id });
    let prediction = null;
    
    if (readings && readings.length >= 2) {
      try {
        prediction = await mlService.getPrediction(req.params.id);
      } catch (err) {
        console.error(`Cost prediction skipped for ${req.params.id}: ${err.message}`);
      }
    } else {
      return res.status(200).json({ projected_daily_cost: 0, projected_monthly_cost: 0, message: "Not enough data" });
    }
    
    // Decouple budget from instantaneous anomaly burn rate
    const burnRate = prediction?.rolling_avg_burn_rate || prediction?.burn_rate_kg_per_day || 0;
    
    // Use generic commercial pricing for now unless cylinder specifies type
    const cylinderType = 'commercial';
    const pricePerKg = PRICING[cylinderType].pricePerUnit;

    // Calculate daily and monthly costs
    const dailyCost = burnRate * pricePerKg;
    const projectedMonthlyCost = dailyCost * 30;

    res.status(200).json({
      currency: 'INR',
      price_per_kg: parseFloat(pricePerKg.toFixed(2)),
      projected_daily_cost: parseFloat(dailyCost.toFixed(2)),
      projected_monthly_cost: parseFloat(projectedMonthlyCost.toFixed(2))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
