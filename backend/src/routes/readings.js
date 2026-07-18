const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access :id from parent router if nested
const readingsController = require('../controllers/readingsController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Note: If mounted at /cylinders/:id/readings in app.js
router.post('/', readingsController.createReading);
router.get('/', readingsController.getReadings);
router.get('/latest', readingsController.getLatestReading);

module.exports = router;
