// routes/authRoutes.js
const express = require('express');
const { registerAdmin, loginAdmin, getAdminProfile, logoutAdmin } = require('../controllers/adminAuthController');

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/profile', getAdminProfile);

module.exports = router;
