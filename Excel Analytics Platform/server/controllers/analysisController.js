const Analysis = require('../models/Analysis');
const Upload = require('../models/Upload');

const createAnalysis = async (req, res) => {
  try {
    const { uploadId, title, chartType, xAxis, yAxis, colorScheme, chartConfig } = req.body;

    // 1️⃣ Verify upload exists and belongs to user
    const upload = await Upload.findOne({
      _id: uploadId,
      userId: req.user._id
    });

    if (!upload) {
      return res.status(404).json({ message: 'Upload not found' });
    }

    // 2️⃣ Validate X and Y axis
    if (!xAxis || !yAxis) {
      return res.status(400).json({ message: 'X and Y axis are required' });
    }

    // 3️⃣ Check if upload data exists
    if (!upload.data || upload.data.length === 0) {
      return res.status(400).json({ message: 'No data found in upload' });
    }

    // 4️⃣ Validate Y-axis is numeric column
    const sampleValue = upload.data[0][yAxis];

    if (isNaN(Number(sampleValue))) {
      return res.status(400).json({
        message: 'Y-axis must be a numeric column'
      });
    }

    // 5️⃣ Calculate insights safely
    const yAxisData = upload.data
      .map(row => Number(row[yAxis]))
      .filter(val => !isNaN(val));

    let insights = {
      average: 0,
      maximum: 0,
      minimum: 0,
      total: 0,
      count: 0
    };

    if (yAxisData.length > 0) {
      const total = yAxisData.reduce((a, b) => a + b, 0);

      insights = {
        average: total / yAxisData.length,
        maximum: Math.max(...yAxisData),
        minimum: Math.min(...yAxisData),
        total: total,
        count: yAxisData.length
      };
    }

    // 6️⃣ Save analysis
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