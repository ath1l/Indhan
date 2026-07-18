const mongoose = require('mongoose');

const cylinderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true, 
  },
  tare_weight_kg: {
    type: Number,
    required: true, 
  },
  capacity_kg: {
    type: Number,
    required: true, 
  },
}, { timestamps: true });

module.exports = mongoose.model('Cylinder', cylinderSchema);
