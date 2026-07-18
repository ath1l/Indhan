const mlService = require('../services/mlService');

exports.getCostProjection = async (req, res) => {
  try {
    const prediction = await mlService.getPrediction(req.params.id);
    const burnRate = prediction?.burn_rate_kg_per_day || 0;
    
    // Mock LPG Price
    const pricePerCylinder = 800; // INR
    const averageCapacityKg = 14.2; 
    const pricePerKg = pricePerCylinder / averageCapacityKg;

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
