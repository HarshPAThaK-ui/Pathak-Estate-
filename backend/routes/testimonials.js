const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public: get all testimonials
router.get('/', testimonialController.getTestimonials);

// Authenticated: create testimonial
router.post('/', authMiddleware, testimonialController.createTestimonial);

// Admin: delete testimonial
router.delete('/:id', authMiddleware, roleMiddleware, testimonialController.deleteTestimonial);

module.exports = router; 