const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const multer = require('multer');
const path = require('path');

// Multer config for images and video
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Admin-only route to get all properties
router.get('/all', authMiddleware, roleMiddleware, propertyController.getAllProperties);
// Route for user's own properties (must come before /:id)
router.get('/my', authMiddleware, propertyController.getMyProperties);
// Public routes
router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getPropertyById);

// Authenticated (user or admin) can create property
router.post('/', authMiddleware, upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'video', maxCount: 1 }
]), propertyController.createProperty);

// Admin-only routes
router.put('/:id/approve', authMiddleware, roleMiddleware, propertyController.approveProperty);
router.put('/:id/reject', authMiddleware, roleMiddleware, propertyController.rejectProperty);
// Update property (user or admin)
router.put('/:id', authMiddleware, upload.fields([
  { name: 'newImages', maxCount: 10 },
  { name: 'newVideo', maxCount: 1 }
]), propertyController.updateProperty);

// Bulk actions (admin only)
router.put('/bulk-approve', authMiddleware, roleMiddleware, propertyController.bulkApproveProperties);
router.put('/bulk-reject', authMiddleware, roleMiddleware, propertyController.bulkRejectProperties);
router.post('/bulk-delete', authMiddleware, roleMiddleware, propertyController.bulkDeleteProperties);
// Single delete (admin only)
router.delete('/:id', authMiddleware, roleMiddleware, propertyController.deleteProperty);

// Admin analytics/stats
router.get('/admin/stats', authMiddleware, roleMiddleware, propertyController.getAdminStats);

module.exports = router; 