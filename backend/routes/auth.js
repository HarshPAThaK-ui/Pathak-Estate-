const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const Property = require('../models/Property');
const User = require('../models/User');
const messageController = require('../controllers/messageController');

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

// Add to favorites
router.post('/favorites/:propertyId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.favorites.includes(req.params.propertyId)) {
      user.favorites.push(req.params.propertyId);
      await user.save();
    }
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove from favorites
router.delete('/favorites/:propertyId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.favorites = user.favorites.filter(
      id => id.toString() !== req.params.propertyId
    );
    await user.save();
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all favorites
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Messaging routes (user <-> broker only)
router.post('/messages', authMiddleware, messageController.sendMessage);
router.get('/messages/:propertyId', authMiddleware, messageController.getMessagesForProperty);
router.get('/messages', authMiddleware, messageController.getUserConversations);

module.exports = router; 