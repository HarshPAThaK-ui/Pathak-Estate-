const Property = require('../models/Property');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const Inquiry = require('../models/Inquiry');

// Configure nodemailer (replace with your real credentials or use env vars)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your_gmail@gmail.com',
    pass: process.env.EMAIL_PASS || 'your_gmail_app_password',
  },
});

async function sendApprovalEmail(to, property) {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'your_gmail@gmail.com',
    to,
    subject: 'Your property has been approved!',
    html: `<p>Dear user,</p>
      <p>Your property <b>${property.title || property.name || 'Property'}</b> has been <b>approved</b> and is now live on Pathak Estates.</p>
      <p><a href="http://localhost:5173/properties/${property._id}">View your property</a></p>
      <p>Thank you for using Pathak Estates!</p>`
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error('Failed to send approval email:', err);
  }
}

// Create property (user or admin)
exports.createProperty = async (req, res) => {
  try {
    console.log('req.user:', req.user);
    if (!req.user) {
      return res.status(401).json({ message: 'User authentication failed. Please log in again.' });
    }
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) return res.status(500).json({ message: 'Admin not found' });

    const images = req.files['images'] ? req.files['images'].map(f => f.path) : [];
    const video = req.files['video'] && req.files['video'][0] ? req.files['video'][0].path : '';

    const property = await Property.create({
      ...req.body,
      images,
      video,
      createdBy: req.user._id,
      broker: admin._id,
      approvalStatus: req.user.role === 'admin' ? 'approved' : 'pending',
    });
    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// List all approved properties (public)
exports.getProperties = async (req, res) => {
  try {
    const {
      keywords,
      propertyType,
      status,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      areaUnit,
      bedrooms,
      bathrooms,
      postalCode,
      areaName,
      location,
      sort
    } = req.query;

    // Build MongoDB query
    const query = { approvalStatus: 'approved' };

    if (keywords) {
      const regex = new RegExp(keywords, 'i');
      query.$or = [
        { name: regex },
        { title: regex },
        { description: regex },
        { location: regex },
        { areaName: regex },
        { address: regex }
      ];
    }
    // Multi-select for propertyType
    if (propertyType) {
      if (Array.isArray(propertyType)) {
        query.propertyType = { $in: propertyType };
      } else {
        query.propertyType = propertyType;
      }
    }
    if (status) query.status = status;
    if (areaUnit) query.areaUnit = areaUnit;
    if (postalCode) query.postalCode = postalCode;
    if (areaName) query.areaName = areaName;
    if (bedrooms) query.bedrooms = Number(bedrooms);
    if (bathrooms) query.bathrooms = Number(bathrooms);
    // Multi-select for location
    if (location) {
      if (Array.isArray(location)) {
        query.location = { $in: location };
      } else {
        query.location = location;
      }
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (minArea || maxArea) {
      query.area = {};
      if (minArea) query.area.$gte = Number(minArea);
      if (maxArea) query.area.$lte = Number(maxArea);
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'priceLow') sortOption = { price: 1 };
    else if (sort === 'priceHigh') sortOption = { price: -1 };
    else if (sort === 'areaLow') sortOption = { area: 1 };
    else if (sort === 'areaHigh') sortOption = { area: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const properties = await Property.find(query)
      .sort(sortOption)
      .populate('createdBy', 'name')
      .populate('broker', 'name');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get property by ID (public, only approved)
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findOne({ _id: req.params.id, approvalStatus: 'approved' }).populate('createdBy', 'name').populate('broker', 'name');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Approve property (admin only)
exports.approveProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { approvalStatus: 'approved' }, { new: true });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    // Send approval email to owner
    const owner = await User.findById(property.createdBy);
    if (owner && owner.email) {
      sendApprovalEmail(owner.email, property);
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reject property (admin only)
exports.rejectProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, { approvalStatus: 'rejected' }, { new: true });
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: List all properties (any status)
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('createdBy', 'name').populate('broker', 'name');
    res.json(properties);
  } catch (err) {
    console.error('Error in getAllProperties:', err);
    res.status(500).json({ message: 'Failed to fetch all properties', error: err.message, stack: err.stack });
  }
};

// Get properties created by the logged-in user
exports.getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ createdBy: req.user._id })
      .populate('createdBy', 'name')
      .populate('broker', 'name');
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update property (user or admin)
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    // Only allow owner or admin
    if (property.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }
    // Update fields
    const updatable = [
      'title', 'description', 'price', 'location', 'area', 'areaUnit', 'bedrooms', 'bathrooms', 'propertyType', 'phone', 'whatsapp', 'address', 'postalCode', 'areaName', 'status', 'features'
    ];
    updatable.forEach(field => {
      if (req.body[field] !== undefined) property[field] = req.body[field];
    });
    // Handle images
    let existingImages = [];
    if (req.body.existingImages) {
      try { existingImages = JSON.parse(req.body.existingImages); } catch {}
    }
    let deletedImages = [];
    if (req.body.deletedImages) {
      try { deletedImages = JSON.parse(req.body.deletedImages); } catch {}
    }
    // Remove deleted images from property.images
    property.images = existingImages.filter(img => !deletedImages.includes(img));
    // Add new images
    if (req.files && req.files['newImages']) {
      req.files['newImages'].forEach(f => property.images.push(f.path));
    }
    // Handle video
    if (req.body.deletedVideo === 'true' || req.body.deletedVideo === true) {
      property.video = '';
    }
    if (req.files && req.files['newVideo'] && req.files['newVideo'][0]) {
      property.video = req.files['newVideo'][0].path;
    }
    await property.save();
    const updated = await Property.findById(property._id).populate('createdBy', 'name').populate('broker', 'name');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Bulk approve properties (admin only)
exports.bulkApproveProperties = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No property IDs provided' });
    }
    const result = await Property.updateMany(
      { _id: { $in: ids } },
      { $set: { approvalStatus: 'approved' } }
    );
    // Send approval emails to all owners
    const properties = await Property.find({ _id: { $in: ids } });
    for (const property of properties) {
      const owner = await User.findById(property.createdBy);
      if (owner && owner.email) {
        sendApprovalEmail(owner.email, property);
      }
    }
    res.json({ message: 'Properties approved', result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Bulk reject properties (admin only)
exports.bulkRejectProperties = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No property IDs provided' });
    }
    const result = await Property.updateMany(
      { _id: { $in: ids } },
      { $set: { approvalStatus: 'rejected' } }
    );
    res.json({ message: 'Properties rejected', result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Bulk delete properties (admin only)
exports.bulkDeleteProperties = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No property IDs provided' });
    }
    const result = await Property.deleteMany({ _id: { $in: ids } });
    res.json({ message: 'Properties deleted', result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Single delete property (admin only)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json({ message: 'Property deleted', property });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin analytics/stats
exports.getAdminStats = async (req, res) => {
  try {
    const [
      totalProperties,
      approvedProperties,
      pendingProperties,
      rejectedProperties,
      totalUsers,
      newUsers,
      totalInquiries,
      newInquiries
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ approvalStatus: 'approved' }),
      Property.countDocuments({ approvalStatus: 'pending' }),
      Property.countDocuments({ approvalStatus: 'rejected' }),
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } }),
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } })
    ]);
    res.json({
      totalProperties,
      approvedProperties,
      pendingProperties,
      rejectedProperties,
      totalUsers,
      newUsers,
      totalInquiries,
      newInquiries
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 