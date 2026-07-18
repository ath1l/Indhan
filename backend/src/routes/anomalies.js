const express = require('express');
const router = express.Router({ mergeParams: true });
const anomaliesController = require('../controllers/anomaliesController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', anomaliesController.getAnomalies);
router.get('/:anomalyId', anomaliesController.getAnomaly);
router.post('/:anomalyId/acknowledge', anomaliesController.acknowledgeAnomaly);

module.exports = router;
