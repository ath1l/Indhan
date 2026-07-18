const express = require('express');
const router = express.Router({ mergeParams: true });
const predictionsController = require('../controllers/predictionsController');

// Mounted at /api/v1/cylinders/:id/prediction
router.get('/', predictionsController.getPrediction);
router.get('/history', predictionsController.getPredictionHistory);

module.exports = router;
