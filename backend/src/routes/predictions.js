const express = require('express');
const router = express.Router({ mergeParams: true });
const predictionsController = require('../controllers/predictionsController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', predictionsController.getPrediction);
router.get('/history', predictionsController.getPredictionHistory);

module.exports = router;
