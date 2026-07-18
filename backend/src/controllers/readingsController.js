const Reading = require('../models/Reading');

exports.addReading = async (req, res) => {
  try {
    const { weight_kg } = req.body;
    const cylinder_id = req.params.id;

    const newReading = new Reading({
      cylinder_id,
      weight_kg
    });

    const reading = await newReading.save();
    res.status(201).json(reading);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReadings = async (req, res) => {
  try {
    const cylinder_id = req.params.id;
    const readings = await Reading.find({ cylinder_id }).sort({ timestamp: -1 });
    res.status(200).json(readings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
