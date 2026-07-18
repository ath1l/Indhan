const Cylinder = require('../models/Cylinder');

exports.createCylinder = async (req, res) => {
  try {
    const { name, tare_weight_kg, capacity_kg } = req.body;
    // Assuming authMiddleware sets req.user
    const userId = req.user ? req.user.id : 'mock_user_id'; 
    
    // In a real app with real auth, we'd save it:
    // const newCylinder = new Cylinder({ user_id: userId, name, tare_weight_kg, capacity_kg });
    // await newCylinder.save();
    
    // Mock response for now
    res.status(201).json({ id: "cyl_001", user_id: userId, name, tare_weight_kg, capacity_kg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCylinders = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 'mock_user_id';
    // const cylinders = await Cylinder.find({ user_id: userId });
    res.status(200).json([
      { id: "cyl_001", user_id: userId, name: "Kitchen Cylinder", tare_weight_kg: 15.3, capacity_kg: 14.2 }
    ]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCylinder = async (req, res) => {
  try {
    res.status(200).json({ id: req.params.id, name: "Kitchen Cylinder", tare_weight_kg: 15.3, capacity_kg: 14.2 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCylinder = async (req, res) => {
  try {
    res.status(200).json({ id: req.params.id, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCylinder = async (req, res) => {
  try {
    res.status(200).json({ message: "Cylinder deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
