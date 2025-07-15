const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  'https://pathak-estate.vercel.app',
  // Add more origins if needed
];
app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('Serving uploads from:', path.join(__dirname, 'uploads'));

// Root route for health checks
app.get('/', (req, res) => {
  res.send('API is running');
});

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