const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Public route for login
router.post('/login', login);

// Protected route to check token validity & get profile
router.get('/me', verifyToken, getMe);

module.exports = router;
