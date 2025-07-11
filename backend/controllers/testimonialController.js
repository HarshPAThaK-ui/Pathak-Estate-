const Testimonial = require('../models/Testimonial');

// Create testimonial (authenticated user)
exports.createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create({
      user: req.user._id,
      message: req.body.message
    });
    res.status(201).json(testimonial);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all testimonials (public)
exports.getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().populate('user', 'name');
    res.json(testimonials);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete testimonial (admin only)
exports.deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Testimonial not found' });
    res.json({ message: 'Testimonial deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 