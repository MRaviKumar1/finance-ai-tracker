const express = require('express');
const router = express.Router();
const { googleSignIn, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/google', googleSignIn);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;
