const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/resend-otp', authController.resendEmailOTP);

// Admin: Get all users
router.get('/users', authMiddleware, roleMiddleware, authController.getAllUsers);
// User: Update own profile
router.put('/profile', authMiddleware, authController.updateProfile);
// User: Get own profile
router.get('/me', authMiddleware, authController.getMe);

module.exports = router; 