const Reading = require('../models/Reading');

exports.createReading = async (req, res) => {
  try {
    const { timestamp, weight_kg } = req.body;
    const cylinderId = req.params.id;
    
    // const newReading = new Reading({ cylinder_id: cylinderId, timestamp, weight_kg });
    // await newReading.save();
    
    res.status(201).json({ id: "read_001", cylinder_id: cylinderId, timestamp: timestamp || new Date(), weight_kg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReadings = async (req, res) => {
  try {
    const { from, to, limit } = req.query;
    res.status(200).json([
      { timestamp: "2026-07-18T10:00:00Z", weight_kg: 5.5 },
      { timestamp: "2026-07-18T12:00:00Z", weight_kg: 5.4 },
      { timestamp: "2026-07-18T14:00:00Z", weight_kg: 5.26 }
    ]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLatestReading = async (req, res) => {
  try {
    res.status(200).json({ timestamp: "2026-07-18T14:00:00Z", weight_kg: 5.26 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
