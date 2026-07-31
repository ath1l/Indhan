const express = require('express');
const router = express.Router();
const cylindersController = require('../controllers/cylindersController');

router.get('/', cylindersController.getAllCylinders);
router.get('/:id', cylindersController.getCylinderById);
router.post('/', cylindersController.createCylinder);
router.delete('/:id', cylindersController.deleteCylinder);

module.exports = router;
