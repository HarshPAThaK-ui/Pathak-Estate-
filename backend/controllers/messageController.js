const Message = require('../models/Message');
const Property = require('../models/Property');
const User = require('../models/User');

// Send a message (user <-> broker only)
exports.sendMessage = async (req, res) => {
  try {
    const { propertyId, content } = req.body;
    if (!propertyId || !content) return res.status(400).json({ message: 'Property and content are required' });
    const property = await Property.findById(propertyId).populate('broker');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    const broker = property.broker;
    if (!broker || broker.role !== 'admin') return res.status(400).json({ message: 'No broker assigned to this property' });
    // Only allow user <-> broker
    let receiver;
    if (req.user.role === 'admin') {
      // Broker sending to user (must specify userId)
      receiver = await User.findById(req.body.userId);
      if (!receiver) return res.status(404).json({ message: 'User not found' });
    } else {
      // User sending to broker
      receiver = broker;
    }
    if (receiver._id.toString() === req.user._id.toString()) return res.status(400).json({ message: 'Cannot message yourself' });
    const message = await Message.create({
      sender: req.user._id,
      receiver: receiver._id,
      property: propertyId,
      content
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all messages for a property (between user and broker)
exports.getMessagesForProperty = async (req, res) => {
  try {
    const { propertyId } = req.params;
    if (!propertyId) return res.status(400).json({ message: 'Property is required' });
    const property = await Property.findById(propertyId).populate('broker');
    if (!property) return res.status(404).json({ message: 'Property not found' });
    const brokerId = property.broker._id.toString();
    // Only allow user or broker to view
    if (req.user.role !== 'admin' && req.user._id.toString() !== property.createdBy.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const messages = await Message.find({
      property: propertyId,
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    }).sort('createdAt');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all conversations for the logged-in user (grouped by property)
exports.getUserConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id }
      ]
    }).populate('property').sort('-createdAt');
    // Group by property
    const conversations = {};
    messages.forEach(msg => {
      const propId = msg.property._id;
      if (!conversations[propId]) conversations[propId] = [];
      conversations[propId].push(msg);
    });
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}; 