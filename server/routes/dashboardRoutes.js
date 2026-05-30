const router = require('express').Router();
const verify = require('../middleware/verifyToken');
const { getSummary } = require('../controllers/dashboardController');
router.get('/summary', verify, getSummary);
module.exports = router;