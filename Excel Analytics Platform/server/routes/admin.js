const express = require('express');
const { getDashboardStats, getAllUsers, updateUserRole } = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', adminAuth, getDashboardStats);
router.get('/users', adminAuth, getAllUsers);
router.put('/users/role', adminAuth, updateUserRole);

module.exports = router;