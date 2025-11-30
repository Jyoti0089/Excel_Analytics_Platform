import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Chart from './Chart';
import ChartControls from './ChartControls';
import DataInsights from './DataInsights';
import Card from '../UI/Card';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import Alert from '../UI/Alert';
import { 
  ArrowDownTrayIcon,
  BookmarkIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

const Analyze = () => {
  const { uploadId } = useParams();
  const [uploadData, setUploadData] = useState(null);
  const [chartConfig, setChartConfig] = useState({
    type: 'bar',
    xAxis: '',
    yAxis: '',
    colorScheme: 'blue'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (uploadId) {
      fetchUploadData();
    } else {
      fetchLatestUpload();
    }
  }, [uploadId]);

  const fetchUploadData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/upload/${uploadId}`);
      setUploadData(response.data.upload);
      
      // Set default axes if available
      if (response.data.upload.headers.length >= 2) {
        setChartConfig(prev => ({
          ...prev,
          xAxis: response.data.upload.headers[0],
          yAxis: response.data.upload.headers[1]
        }));
      }
    } catch (error) {
      console.error('Failed to load upload data:', error);
      setError('Failed to load upload data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestUpload = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/upload');
      if (response.data.uploads.length > 0) {
        const latestUpload = response.data.uploads[0];
        const dataResponse = await axios.get(`/api/upload/${latestUpload._id}`);
        setUploadData(dataResponse.data.upload);
        
        if (dataResponse.data.upload.headers.length >= 2) {
          setChartConfig(prev => ({
            ...prev,
            xAxis: dataResponse.data.upload.headers[0],
            yAxis: dataResponse.data.upload.headers[1]
          }));
        }
      } else {
        setError('No uploads found. Please upload a file first.');
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (newConfig) => {
    setChartConfig(prev => ({ ...prev, ...newConfig }));
  };

  const saveAnalysis = async () => {
    if (!uploadData || !chartConfig.xAxis || !chartConfig.yAxis) {
      toast.error('Please configure your chart before saving');
      return;
    }

    setSaving(true);
    try {
      const analysisData = {
        uploadId: uploadData.id,
        title: `${chartConfig.yAxis} vs ${chartConfig.xAxis}`,
        chartType: chartConfig.type,
        xAxis: chartConfig.xAxis,
        yAxis: chartConfig.yAxis,
        colorScheme: chartConfig.colorScheme,
        chartConfig: chartConfig
      };

      await axios.post('/api/analysis', analysisData);
      toast.success('Analysis saved successfully!');
    } catch (error) {
      console.error('Failed to save analysis:', error);
      toast.error('Failed to save analysis. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const downloadChart = () => {
    // This will be handled by the Chart component
    const event = new CustomEvent('downloadChart');
    window.dispatchEvent(event);
  };

  const refreshData = () => {
    if (uploadId) {
      fetchUploadData();
    } else {
      fetchLatestUpload();
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading data..." />;
  }

  if (error && !uploadData) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Alert 
            type="error" 
            title="Unable to Load Data"
            message={error}
            className="mb-6"
          />
          <Card>
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
              <p className="text-gray-600 mb-6">Please upload an Excel file first to start analyzing your data.</p>
              <div className="space-x-3">
                <Button onClick={refreshData} variant="outline">
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={() => window.location.href = '/upload'} variant="primary">
                  Upload File
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">Analyze Data</h1>
            <p className="text-gray-600 mt-1">
              Create interactive charts from your Excel data
            </p>
            {uploadData && (
              <p className="text-sm text-gray-500 mt-2">
                Source: <span className="font-medium">{uploadData.fileName || 'Unknown file'}</span>
                {uploadData.rowCount && (
                  <span> • {uploadData.rowCount.toLocaleString()} rows</span>
                )}
              </p>
            )}
          </div>
          <div className="flex space-x-3">
            <Button 
              onClick={downloadChart}
              variant="outline"
              className="flex items-center"
            >
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button 
              onClick={saveAnalysis} 
              loading={saving}
              variant="primary"
              className="flex items-center"
            >
              <BookmarkIcon className="h-4 w-4 mr-2" />
              Save Analysis
            </Button>
          </div>
        </div>

        {error && (
          <Alert 
            type="warning" 
            message={error} 
            className="mb-6"
            closable
            onClose={() => setError('')}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Controls */}
          <div className="lg:col-span-1 space-y-6">
            {uploadData && (
              <ChartControls
                headers={uploadData.headers}
                config={chartConfig}
                onChange={handleConfigChange}
              />
            )}
            
            {/* Data Insights */}
            {uploadData && chartConfig.xAxis && chartConfig.yAxis && (
              <DataInsights
                data={uploadData.data}
                xAxis={chartConfig.xAxis}
                yAxis={chartConfig.yAxis}
              />
            )}
          </div>

          {/* Chart Display */}
          <div className="lg:col-span-2">
            <Card>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {chartConfig.yAxis && chartConfig.xAxis 
                    ? `${chartConfig.yAxis} vs ${chartConfig.xAxis}`
                    : 'Data Visualization'
                  }
                </h3>
                {chartConfig.yAxis && chartConfig.xAxis && (
                  <p className="text-sm text-gray-500 mt-1">
                    {chartConfig.type.charAt(0).toUpperCase() + chartConfig.type.slice(1)} chart • {chartConfig.colorScheme} color scheme
                  </p>
                )}
              </div>
              
              <div style={{ height: '400px' }}>
                {uploadData?.data && chartConfig.xAxis && chartConfig.yAxis ? (
                  <Chart
                    data={uploadData.data}
                    config={chartConfig}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <svg className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-lg font-medium mb-2">Configure Your Chart</p>
                    <p className="text-sm text-center">Select X and Y axes from the controls panel to generate your visualization</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyze;