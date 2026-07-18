const mongoose = require('mongoose');

const cylinderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true, // e.g., 'Kitchen Cylinder', 'Main'
  },
  tare_weight_kg: {
    type: Number,
    required: true, // Empty weight of the cylinder
  },
  capacity_kg: {
    type: Number,
    required: true, // Capacity of gas it can hold (e.g., 14.2)
  },
}, { timestamps: true });

module.exports = mongoose.model('Cylinder', cylinderSchema);
