// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, getUserProfile, logoutUser } = require('../controllers/userAuthController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

module.exports = router;
