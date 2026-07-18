const mongoose = require('mongoose');

const readingSchema = new mongoose.Schema({
  cylinder_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cylinder',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  weight_kg: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['real', 'simulation'],
    default: 'real',
  },
});

module.exports = mongoose.model('Reading', readingSchema);
