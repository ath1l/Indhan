let currentLpgPrice = 900.50; // Mock current price ₹/kg or ₹/cylinder

exports.getCost = async (req, res) => {
  try {
    // In a real app, calculate cost based on current consumption and price
    res.status(200).json({
      cylinder_id: req.params.id,
      projected_daily_cost: 15.5,
      projected_monthly_cost: 465.0,
      currency: "INR"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCurrentPrice = async (req, res) => {
  try {
    res.status(200).json({ price: currentLpgPrice, currency: "INR", unit: "per_14.2kg" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCurrentPrice = async (req, res) => {
  try {
    if (req.body.price) {
      currentLpgPrice = req.body.price;
    }
    res.status(200).json({ price: currentLpgPrice, currency: "INR", unit: "per_14.2kg" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
