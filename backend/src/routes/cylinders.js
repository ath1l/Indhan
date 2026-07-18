const express = require('express');
const router = express.Router();
const cylindersController = require('../controllers/cylindersController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', cylindersController.createCylinder);
router.get('/', cylindersController.getCylinders);
router.get('/:id', cylindersController.getCylinder);
router.put('/:id', cylindersController.updateCylinder);
router.delete('/:id', cylindersController.deleteCylinder);

module.exports = router;
