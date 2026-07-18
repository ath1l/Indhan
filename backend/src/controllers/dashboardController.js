const mlService = require('../services/mlService');

exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'mock_user_id';
    
    // In a real app, fetch all cylinders for user, then fetch latest reading, prediction, and alerts for each.
    // For prototype, we mock the aggregate response.
    const mockSummary = {
      user_id: userId,
      total_cylinders: 1,
      cylinders: [
        {
          id: "cyl_001",
          name: "Kitchen Cylinder",
          latest_reading: {
            timestamp: "2026-07-18T14:00:00Z",
            weight_kg: 5.26
          },
          prediction: await mlService.getPrediction("cyl_001"),
          active_alerts: await mlService.getAnomalies("cyl_001")
        }
      ]
    };

    res.status(200).json(mockSummary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
