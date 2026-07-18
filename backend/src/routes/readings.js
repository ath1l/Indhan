const express = require('express');
const router = express.Router({ mergeParams: true });
const readingsController = require('../controllers/readingsController');

router.post('/', readingsController.addReading);
router.post('/simulate', readingsController.simulateUsage);
router.post('/simulate-history', readingsController.simulateHistory);
router.get('/', readingsController.getReadings);

module.exports = router;
