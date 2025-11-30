const User = require('../models/User');
const Upload = require('../models/Upload');
const Analysis = require('../models/Analysis');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalUploads = await Upload.countDocuments();
    const totalAnalyses = await Analysis.countDocuments();
    
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUploads = await Upload.find()
      .populate('userId', 'name email')
      .sort({ uploadedAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalUploads,
        totalAnalyses
      },
      recentUsers,
      recentUploads
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId, isAdmin } = req.body;
    
    await User.findByIdAndUpdate(userId, { isAdmin });
    res.json({ success: true, message: 'User role updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDashboardStats, getAllUsers, updateUserRole };