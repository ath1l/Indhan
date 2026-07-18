const express = require('express');
const router = express.Router({ mergeParams: true });
const readingsController = require('../controllers/readingsController');

router.post('/', readingsController.addReading);
router.get('/', readingsController.getReadings);

module.exports = router;
