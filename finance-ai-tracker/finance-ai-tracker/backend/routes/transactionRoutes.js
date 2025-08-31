const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  parseTransaction,
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');

router.post('/parse', auth, parseTransaction);
router.post('/', auth, createTransaction);
router.get('/', auth, getTransactions);
router.put('/:id', auth, updateTransaction);
router.delete('/:id', auth, deleteTransaction);

module.exports = router;
