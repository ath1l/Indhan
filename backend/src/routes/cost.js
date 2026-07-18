const express = require('express');
const router = express.Router();
const costController = require('../controllers/costController');

// Mounted at /api/v1/ in app.js
router.get('/cylinders/:id/cost', costController.getCostProjection);

module.exports = router;
