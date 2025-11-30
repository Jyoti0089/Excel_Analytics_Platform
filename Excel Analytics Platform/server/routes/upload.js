const express = require('express');
const { uploadFile, getUploads, getUploadData } = require('../controllers/uploadController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/', auth, upload.single('file'), uploadFile);
router.get('/', auth, getUploads);
router.get('/:id', auth, getUploadData);

module.exports = router;