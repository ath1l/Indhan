const express = require('express');
const router = express.Router({ mergeParams: true });
const costController = require('../controllers/costController');
const authMiddleware = require('../middleware/authMiddleware');

// Mount this for /cylinders/:id/cost
router.get('/cylinders/:id/cost', authMiddleware, costController.getCost);

// Mount this for /pricing/current
router.get('/pricing/current', costController.getCurrentPrice);
router.put('/pricing/current', authMiddleware, costController.updateCurrentPrice);

module.exports = router;
