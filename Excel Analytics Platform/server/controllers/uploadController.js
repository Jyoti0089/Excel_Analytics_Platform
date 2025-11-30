const Upload = require('../models/Upload');
const XLSX = require('xlsx');

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Parse Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    if (jsonData.length === 0) {
      return res.status(400).json({ message: 'Excel file is empty' });
    }

    const headers = Object.keys(jsonData[0]);

    // Save to database
    const upload = await Upload.create({
      userId: req.user._id,
      fileName: `${Date.now()}-${req.file.originalname}`,
      originalName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      data: jsonData,
      headers,
      rowCount: jsonData.length
    });

    res.json({
      success: true,
      message: 'File uploaded successfully',
      upload: {
        id: upload._id,
        fileName: upload.originalName,
        headers: upload.headers,
        rowCount: upload.rowCount,
        data: jsonData.slice(0, 10) // Preview first 10 rows
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
};

const getUploads = async (req, res) => {
  try {
    const uploads = await Upload.find({ userId: req.user._id })
      .select('-data')
      .sort({ uploadedAt: -1 });

    res.json({
      success: true,
      uploads
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUploadData = async (req, res) => {
  try {
    const upload = await Upload.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }

    res.json({
      success: true,
      upload: {
        id: upload._id,
        headers: upload.headers,
        data: upload.data,
        rowCount: upload.rowCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { uploadFile, getUploads, getUploadData };