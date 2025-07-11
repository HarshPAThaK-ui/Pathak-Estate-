const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String },
  description: { type: String },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  images: [String], // Array of image URLs/paths
  video: String,    // Video URL/path
  status: { type: String, enum: ['for sale', 'for rent'], required: true },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  broker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // always admin
  features: [String],
  area: { type: Number, required: true }, // in sqft or sqm
  areaUnit: { type: String, enum: ['sqft', 'sqm', 'gaj', 'bigha', 'acre', 'hectare', 'marla', 'kanal', 'other'], required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  propertyType: { type: String, enum: ['apartment', 'house', 'villa', 'plot', 'commercial', 'other'], required: true },
  phone: { type: String, required: true },
  whatsapp: { type: String, required: true },
  listedAt: { type: Date, default: Date.now },
  address: { type: String, required: true },
  postalCode: { type: String, required: true },
  areaName: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema); 