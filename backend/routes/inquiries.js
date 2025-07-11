const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public: submit inquiry
router.post('/', inquiryController.createInquiry);

// Public: submit general contact message
router.post('/contact', inquiryController.createContactMessage);

// Admin: get all inquiries
router.get('/', authMiddleware, roleMiddleware, inquiryController.getInquiries);

// Admin: get all contact messages
router.get('/contact', authMiddleware, roleMiddleware, inquiryController.getContactMessages);

// Admin: delete a contact message
router.delete('/contact/:id', authMiddleware, roleMiddleware, inquiryController.deleteContactMessage);

module.exports = router; 