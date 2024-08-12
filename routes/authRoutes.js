// routes/authRoutes.js
const express = require('express');
const { registerUser, loginUser, getUserProfile, logoutUser } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', getUserProfile);

module.exports = router;
