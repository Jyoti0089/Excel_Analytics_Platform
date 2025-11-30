// client/src/components/History/History.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Card from '../UI/Card';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import Alert from '../UI/Alert';
import Modal from '../UI/Modal';
import { 
  ChartBarIcon, 
  TrashIcon, 
  EyeIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

const History = () => {
  const [analyses, setAnalyses] = useState([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [deleteModal, setDeleteModal] = useState({ open: false, analysis: null });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalyses();
  }, []);

  useEffect(() => {
    filterAndSortAnalyses();
  }, [analyses, searchTerm, filterType, sortBy]);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/analysis');
      setAnalyses(response.data.analyses || []);
    } catch (error) {
      console.error('Failed to fetch analysis history:', error);
      const errorMessage = error.response?.data?.message || 'Failed to load analysis history';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortAnalyses = () => {
    let filtered = [...analyses];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(analysis =>
        analysis.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analysis.xAxis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analysis.yAxis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analysis.chartType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(analysis => analysis.chartType === filterType);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'title':
        filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'type':
        filtered.sort((a, b) => (a.chartType || '').localeCompare(b.chartType || ''));
        break;
      default:
        break;
    }

    setFilteredAnalyses(filtered);
  };

  const confirmDelete = (analysis) => {
    setDeleteModal({ open: true, analysis });
  };

  const deleteAnalysis = async () => {
    const { analysis } = deleteModal;
    if (!analysis) return;

    setDeleting(prev => ({ ...prev, [analysis._id]: true }));

    try {
      await axios.delete(`/api/analysis/${analysis._id}`);
      setAnalyses(prev => prev.filter(a => a._id !== analysis._id));
      toast.success('Analysis deleted successfully');
    } catch (error) {
      console.error('Failed to delete analysis:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete analysis';
      toast.error(errorMessage);
    } finally {
      setDeleting(prev => ({ ...prev, [analysis._id]: false }));
      setDeleteModal({ open: false, analysis: null });
    }
  };

  const getChartIcon = (chartType) => {
    const iconProps = { className: "h-5 w-5" };
    return <ChartBarIcon {...iconProps} />;
  };

  const getChartTypeLabel = (chartType) => {
    const labels = {
      bar: 'Bar Chart',
      line: 'Line Chart',
      pie: 'Pie Chart',
      doughnut: 'Doughnut Chart',
      scatter: 'Scatter Plot'
    };
    return labels[chartType] || (chartType ? chartType.charAt(0).toUpperCase() + chartType.slice(1) : 'Unknown');
  };

  const getChartTypeColor = (chartType) => {
    const colors = {
      bar: 'bg-blue-100 text-blue-800',
      line: 'bg-green-100 text-green-800',
      pie: 'bg-purple-100 text-purple-800',
      doughnut: 'bg-pink-100 text-pink-800',
      scatter: 'bg-yellow-100 text-yellow-800'
    };
    return colors[chartType] || 'bg-gray-100 text-gray-800';
  };

  const exportAnalysis = (analysis) => {
    try {
      const exportData = {
        title: analysis.title,
        chartType: analysis.chartType,
        xAxis: analysis.xAxis,
        yAxis: analysis.yAxis,
        colorScheme: analysis.colorScheme,
        createdAt: analysis.createdAt,
        insights: analysis.insights
      };
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `analysis-${analysis.title.replace(/\s+/g, '-')}-${Date.now()}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast.success('Analysis exported successfully');
    } catch (error) {
      toast.error('Failed to export analysis');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setSortBy('newest');
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading analysis history..." />;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">Analysis History</h1>
            <p className="text-gray-600 mt-1">
              View and manage your saved chart analyses 
              {analyses.length > 0 && ` (${analyses.length} total)`}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              onClick={fetchAnalyses} 
              variant="outline" 
              size="sm"
              disabled={loading}
            >
              Refresh
            </Button>
            <Link to="/upload">
              <Button variant="primary" className="flex items-center">
                <PlusIcon className="h-4 w-4 mr-2" />
                Create New Analysis
              </Button>
            </Link>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert 
            type="error" 
            message={error} 
            className="mb-6"
            closable
            onClose={() => setError('')}
          />
        )}

        {/* Search and Filters */}
        {analyses.length > 0 && (
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search analyses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Filter by Type */}
              <div className="relative">
                <FunnelIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="pl-10 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="all">All Chart Types</option>
                  <option value="bar">Bar Charts</option>
                  <option value="line">Line Charts</option>
                  <option value="pie">Pie Charts</option>
                  <option value="doughnut">Doughnut Charts</option>
                  <option value="scatter">Scatter Plots</option>
                </select>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Sort by Title</option>
                <option value="type">Sort by Type</option>
              </select>

              {/* Clear Filters */}
              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </Card>
        )}

        {/* Results Count */}
        {(searchTerm || filterType !== 'all') && analyses.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Showing {filteredAnalyses.length} of {analyses.length} analyses
              {searchTerm && <span> matching "{searchTerm}"</span>}
              {filterType !== 'all' && <span> filtered by {getChartTypeLabel(filterType)}</span>}
            </p>
          </div>
        )}

        {/* Analyses Grid */}
        {filteredAnalyses.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <ChartBarIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {analyses.length === 0 ? 'No analyses yet' : 'No analyses found'}
              </h3>
              <p className="text-gray-600 mb-6">
                {analyses.length === 0 
                  ? 'Upload an Excel file and create your first chart analysis'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {analyses.length === 0 ? (
                <Link to="/upload">
                  <Button variant="primary">Upload File</Button>
                </Link>
              ) : (
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnalyses.map((analysis) => (
              <Card 
                key={analysis._id} 
                hover 
                className="transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="flex-shrink-0 text-indigo-600 mr-3">
                      {getChartIcon(analysis.chartType)}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 truncate" title={analysis.title || 'Untitled'}>
                      {analysis.title || 'Untitled Analysis'}
                    </h3>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getChartTypeColor(analysis.chartType)}`}>
                    {analysis.chartType || 'unknown'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{new Date(analysis.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-md p-3 mb-4">
                  <div className="text-xs text-gray-500 mb-1">Configuration</div>
                  <div className="text-sm space-y-1">
                    <div>
                      <span className="font-medium text-gray-700">X-Axis:</span> 
                      <span className="ml-1 text-gray-900">{analysis.xAxis || 'Not specified'}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Y-Axis:</span> 
                      <span className="ml-1 text-gray-900">{analysis.yAxis || 'Not specified'}</span>
                    </div>
                    {analysis.colorScheme && (
                      <div>
                        <span className="font-medium text-gray-700">Colors:</span> 
                        <span className="ml-1 text-gray-900 capitalize">{analysis.colorScheme}</span>
                      </div>
                    )}
                  </div>
                </div>

                {analysis.insights && (
                  <div className="bg-blue-50 rounded-md p-3 mb-4 border border-blue-200">
                    <div className="text-xs text-blue-600 mb-1 font-medium">Quick Stats</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {analysis.insights.count && (
                        <div>
                          <span className="text-blue-700">Count:</span>
                          <br />
                          <span className="font-medium text-blue-900">{analysis.insights.count.toLocaleString()}</span>
                        </div>
                      )}
                      {analysis.insights.average && (
                        <div>
                          <span className="text-blue-700">Average:</span>
                          <br />
                          <span className="font-medium text-blue-900">{parseFloat(analysis.insights.average).toFixed(2)}</span>
                        </div>
                      )}
                      {analysis.insights.maximum && (
                        <div>
                          <span className="text-blue-700">Max:</span>
                          <br />
                          <span className="font-medium text-blue-900">{analysis.insights.maximum.toLocaleString()}</span>
                        </div>
                      )}
                      {analysis.insights.minimum && (
                        <div>
                          <span className="text-blue-700">Min:</span>
                          <br />
                          <span className="font-medium text-blue-900">{analysis.insights.minimum.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center space-x-2">
                  <div className="flex space-x-2">
                    {/* 
                    <Link to={`/analyze/${analysis.uploadId}`}>
                    <Button size="sm" variant="outline" className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View
                    </Button>
                    </Link>
                    */}
                    
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => exportAnalysis(analysis)}
                      className="flex items-center"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => confirmDelete(analysis)}
                    loading={deleting[analysis._id]}
                    className="flex items-center"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, analysis: null })}
          title="Delete Analysis"
          footer={
            <>
              <Button
                variant="outline"
                onClick={() => setDeleteModal({ open: false, analysis: null })}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={deleteAnalysis}
                loading={deleteModal.analysis && deleting[deleteModal.analysis._id]}
              >
                Delete
              </Button>
            </>
          }
        >
          <p className="text-sm text-gray-600">
            Are you sure you want to delete the analysis "{deleteModal.analysis?.title || 'Untitled'}"? 
            This action cannot be undone.
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default History;