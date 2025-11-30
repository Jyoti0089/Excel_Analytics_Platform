const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  uploadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Upload',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  chartType: {
    type: String,
    required: true,
    enum: ['bar', 'line', 'pie', 'scatter', 'doughnut', '3d-column']
  },
  xAxis: {
    type: String,
    required: true
  },
  yAxis: {
    type: String,
    required: true
  },
  colorScheme: {
    type: String,
    default: 'blue'
  },
  chartConfig: {
    type: mongoose.Schema.Types.Mixed
  },
  insights: {
    average: Number,
    maximum: Number,
    minimum: Number,
    total: Number,
    count: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Analysis', analysisSchema);