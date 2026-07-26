const express = require('express');
const router = express.Router();
const { login, logout, getMe } = require('../controllers/authController');
const { verifyAdmin } = require('../middleware/auth');

router.post('/login', login);
router.post('/logout', logout);
router.get('/me', verifyAdmin, getMe);

module.exports = router;
