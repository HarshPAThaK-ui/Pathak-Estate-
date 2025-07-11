const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const ContactMessage = require('../models/ContactMessage');

// Email notification function
const sendInquiryEmail = async (property, inquiry) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.BROKER_EMAIL,
    subject: `New Inquiry for Property: ${property.title}`,
    html: `<h3>New Inquiry Received</h3>
      <p><b>Property:</b> ${property.title}</p>
      <p><b>Name:</b> ${inquiry.name}</p>
      <p><b>Email:</b> ${inquiry.email}</p>
      <p><b>Phone:</b> ${inquiry.phone || 'N/A'}</p>
      <p><b>Message:</b> ${inquiry.message || 'N/A'}</p>`
  };

  await transporter.sendMail(mailOptions);
};

// Create inquiry (public)
exports.createInquiry = async (req, res) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;
    const property = await Property.findById(propertyId).populate('broker');
    if (!property || property.approvalStatus !== 'approved') {
      return res.status(404).json({ message: 'Property not found or not approved' });
    }
    const inquiry = await Inquiry.create({
      property: propertyId,
      name,
      email,
      phone,
      message
    });
    // Send email notification to broker
    await sendInquiryEmail(property, inquiry);
    res.status(201).json({ message: 'Inquiry sent to broker', inquiry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all inquiries (admin only)
exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find().populate('property', 'title');
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create general contact message (public)
exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    // Save to DB
    await ContactMessage.create({ name, email, phone, subject, message });
    // Send email to admin
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.BROKER_EMAIL,
      subject: `Contact Form: ${subject || 'New Message'}`,
      html: `<h3>New Contact Message</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || 'N/A'}</p>
        <p><b>Subject:</b> ${subject || 'N/A'}</p>
        <p><b>Message:</b> ${message || 'N/A'}</p>`
    };
    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteContactMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 