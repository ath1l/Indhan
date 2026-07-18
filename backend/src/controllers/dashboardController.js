const mlService = require('../services/mlService');
const Cylinder = require('../models/Cylinder');
const Reading = require('../models/Reading');

exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'mock_user_id';
    
    // Fetch user's cylinders (fetching all for now due to lack of active auth token in mock)
    const cylindersDb = await Cylinder.find();
    
    if (cylindersDb.length === 0) {
      return res.status(200).json({ user_id: userId, total_cylinders: 0, cylinders: [] });
    }

    // Fetch latest reading, prediction, and anomalies for each
    const cylindersData = await Promise.all(cylindersDb.map(async (cyl) => {
      // Get latest reading
      const latestReading = await Reading.findOne({ cylinder_id: cyl._id }).sort({ timestamp: -1 });
      
      let prediction = null;
      let active_alerts = [];

      if (latestReading) {
        try {
          prediction = await mlService.getPrediction(cyl._id.toString());
          active_alerts = await mlService.getAnomalies(cyl._id.toString());
        } catch (mlErr) {
          console.error(`ML skipped for ${cyl.name}: ${mlErr.message}`);
        }
      }

      return {
        id: cyl._id.toString(),
        name: cyl.name,
        latest_reading: latestReading ? {
          timestamp: latestReading.timestamp,
          weight_kg: latestReading.weight_kg
        } : null,
        prediction,
        active_alerts
      };
    }));

    const summary = {
      user_id: userId,
      total_cylinders: cylindersData.length,
      cylinders: cylindersData
    };

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
