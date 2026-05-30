const router = require('express').Router();
const verify = require('../middleware/verifyToken');
const ctrl   = require('../controllers/groceryController');
router.get('/',          verify, ctrl.getItems);
router.post('/',         verify, ctrl.addItem);
router.put('/:id',       verify, ctrl.updateItem);
router.delete('/:id',    verify, ctrl.deleteItem);
router.patch('/:id/qty', verify, ctrl.updateQuantity);
module.exports = router;