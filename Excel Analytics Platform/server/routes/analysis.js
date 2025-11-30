const express = require('express');
const { createAnalysis, getAnalyses, getAnalysis, deleteAnalysis } = require('../controllers/analysisController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createAnalysis);
router.get('/', auth, getAnalyses);
router.get('/:id', auth, getAnalysis);
router.delete('/:id', auth, deleteAnalysis);

module.exports = router;