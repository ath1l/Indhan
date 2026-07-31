const Cylinder = require('../models/Cylinder');
const Reading = require('../models/Reading');

exports.getAllCylinders = async (req, res) => {
  try {
    // In a real app with auth middleware, we'd use req.user.id
    // For now, we'll just fetch all or from the mock user if needed.
    const cylinders = await Cylinder.find();
    res.status(200).json(cylinders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCylinderById = async (req, res) => {
  try {
    const cylinder = await Cylinder.findById(req.params.id);
    if (!cylinder) {
      return res.status(404).json({ message: 'Cylinder not found' });
    }
    res.status(200).json(cylinder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCylinder = async (req, res) => {
  try {
    const { name, tare_weight_kg, capacity_kg, user_id } = req.body;
    const newCylinder = new Cylinder({
      name,
      tare_weight_kg,
      capacity_kg,
      user_id: user_id || '60c72b2f9b1d8b001c8e4d3a' // Fallback for testing
    });
    const cylinder = await newCylinder.save();
    res.status(201).json(cylinder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCylinder = async (req, res) => {
  try {
    const cylinder = await Cylinder.findByIdAndDelete(req.params.id);
    if (!cylinder) {
      return res.status(404).json({ message: 'Cylinder not found' });
    }
    // Cleanup orphaned telemetry
    await Reading.deleteMany({ cylinder_id: req.params.id });
    res.status(200).json({ message: 'Cylinder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
