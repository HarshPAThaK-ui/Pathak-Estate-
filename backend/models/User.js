const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: { type: String },
  avatar: { type: String },
  isVerified: { type: Boolean, default: false },
  emailVerificationOTP: { type: String },
  emailVerificationOTPExpires: { type: Date },
  resetPasswordOTP: { type: String },
  resetPasswordOTPExpires: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema); 