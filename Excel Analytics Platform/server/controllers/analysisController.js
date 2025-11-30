const Analysis = require('../models/Analysis');
const Upload = require('../models/Upload');

const createAnalysis = async (req, res) => {
  try {
    const { uploadId, title, chartType, xAxis, yAxis, colorScheme, chartConfig } = req.body;

    // Verify upload exists and belongs to user
    const upload = await Upload.findOne({
      _id: uploadId,
      userId: req.user._id
    });

    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }

    // Calculate insights
    const yAxisData = upload.data
      .map(row => Number(row[yAxis]))
      .filter(val => !isNaN(val));

    const insights = {
      average: yAxisData.reduce((a, b) => a + b, 0) / yAxisData.length,
      maximum: Math.max(...yAxisData),
      minimum: Math.min(...yAxisData),
      total: yAxisData.reduce((a, b) => a + b, 0),
      count: yAxisData.length
    };

    const analysis = await Analysis.create({
      userId: req.user._id,
      uploadId,
      title,
      chartType,
      xAxis,
      yAxis,
      colorScheme,
      chartConfig,
      insights
    });

    res.status(201).json({
      success: true,
      message: 'Analysis saved successfully',
      analysis
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAnalyses = async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user._id })
      .populate('uploadId', 'originalName')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      analyses
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('uploadId');

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.json({
      success: true,
      analysis
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    res.json({
      success: true,
      message: 'Analysis deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createAnalysis, getAnalyses, getAnalysis, deleteAnalysis };