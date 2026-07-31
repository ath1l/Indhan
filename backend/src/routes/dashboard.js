const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// The instructions specifically requested a GET / route
router.get('/', dashboardController.getDashboardSummary);
// I am also keeping /summary just in case the frontend relies on the older /api/v1/dashboard/summary contract
router.get('/summary', dashboardController.getDashboardSummary);

module.exports = router;
