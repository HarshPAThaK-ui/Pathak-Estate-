const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('Serving uploads from:', path.join(__dirname, 'uploads'));
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Import routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const propertyRoutes = require('./routes/properties');
app.use('/api/properties', propertyRoutes);
const inquiryRoutes = require('./routes/inquiries');
app.use('/api/inquiries', inquiryRoutes);
const testimonialRoutes = require('./routes/testimonials');
app.use('/api/testimonials', testimonialRoutes);
// (To be added: properties, inquiries, testimonials)

// Error handler middleware (to be added)

module.exports = app; 