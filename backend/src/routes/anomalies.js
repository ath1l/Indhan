const express = require('express');
// mergeParams is critical here since we are inheriting :id from the parent mount path
const router = express.Router({ mergeParams: true });
const anomaliesController = require('../controllers/anomaliesController');

router.get('/', anomaliesController.getAnomalies);
router.get('/:anomalyId', anomaliesController.getAnomaly);
router.post('/:anomalyId/acknowledge', anomaliesController.acknowledgeAnomaly);

module.exports = router;
