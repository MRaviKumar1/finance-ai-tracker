const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getSummary, getSpendingByCategory, getSpendingTrends } = require('../controllers/analyticsController');

router.get('/summary', auth, getSummary);
router.get('/categories', auth, getSpendingByCategory);
router.get('/trends', auth, getSpendingTrends);

module.exports = router;
