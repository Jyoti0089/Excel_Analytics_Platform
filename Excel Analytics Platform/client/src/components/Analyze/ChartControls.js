import React from 'react';
import Card from '../UI/Card';
import { ChartBarIcon } from '@heroicons/react/24/outline';

const ChartControls = ({ headers, config, onChange }) => {
  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', description: 'Compare categories' },
    { value: 'line', label: 'Line Chart', description: 'Show trends over time' },
    { value: 'pie', label: 'Pie Chart', description: 'Show proportions' },
    { value: 'doughnut', label: 'Doughnut Chart', description: 'Modern pie chart' },
    { value: 'scatter', label: 'Scatter Plot', description: 'Find correlations' }
  ];

  const colorSchemes = [
    { value: 'blue', label: 'Blue Ocean', color: 'bg-blue-500' },
    { value: 'green', label: 'Forest Green', color: 'bg-green-500' },
    { value: 'red', label: 'Fire Red', color: 'bg-red-500' },
    { value: 'purple', label: 'Royal Purple', color: 'bg-purple-500' },
    { value: 'rainbow', label: 'Rainbow', color: 'bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400' }
  ];

  // Detect numeric columns for better Y-axis suggestions
  const getColumnType = (header) => {
    // This is a simple heuristic - in a real app, you'd analyze the data
    const numericKeywords = ['amount', 'count', 'number', 'price', 'value', 'total', 'sum', 'avg', 'average'];
    const dateKeywords = ['date', 'time', 'year', 'month', 'day'];
    
    const headerLower = header.toLowerCase();
    
    if (numericKeywords.some(keyword => headerLower.includes(keyword))) {
      return 'numeric';
    }
    if (dateKeywords.some(keyword => headerLower.includes(keyword))) {
      return 'date';
    }
    return 'text';
  };

  const getHeaderIcon = (header) => {
    const type = getColumnType(header);
    switch (type) {
      case 'numeric':
        return '🔢';
      case 'date':
        return '📅';
      default:
        return '📝';
    }
  };

  return (
    <Card>
      <div className="flex items-center mb-4">
        <ChartBarIcon className="h-5 w-5 text-indigo-600 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Chart Configuration</h3>
      </div>
      
      <div className="space-y-6">
        {/* Chart Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Chart Type
          </label>
          <div className="grid grid-cols-1 gap-3">
            {chartTypes.map((type) => (
              <label
                key={type.value}
                className={`relative flex cursor-pointer rounded-lg p-3 border transition-all duration-200 ${
                  config.type === type.value
                    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500 ring-opacity-20'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="chartType"
                  value={type.value}
                  checked={config.type === type.value}
                  onChange={(e) => onChange({ type: e.target.value })}
                  className="sr-only"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {type.label}
                  </span>
                  <span className="text-xs text-gray-500">
                    {type.description}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* X Axis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            X-Axis (Categories)
          </label>
          <select
            value={config.xAxis}
            onChange={(e) => onChange({ xAxis: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select X-Axis Column</option>
            {headers.map((header) => (
              <option key={header} value={header}>
                {getHeaderIcon(header)} {header}
              </option>
            ))}
          </select>
          {config.xAxis && (
            <p className="mt-1 text-xs text-gray-500">
              Selected: {config.xAxis}
            </p>
          )}
        </div>

        {/* Y Axis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Y-Axis (Values)
          </label>
          <select
            value={config.yAxis}
            onChange={(e) => onChange({ yAxis: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Y-Axis Column</option>
            {headers.map((header) => (
              <option key={header} value={header}>
                {getHeaderIcon(header)} {header}
              </option>
            ))}
          </select>
          {config.yAxis && (
            <p className="mt-1 text-xs text-gray-500">
              Selected: {config.yAxis}
            </p>
          )}
        </div>

        {/* Color Scheme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Color Scheme
          </label>
          <div className="grid grid-cols-1 gap-3">
            {colorSchemes.map((scheme) => (
              <label
                key={scheme.value}
                className={`relative flex cursor-pointer rounded-lg p-3 border transition-all duration-200 ${
                  config.colorScheme === scheme.value
                    ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500 ring-opacity-20'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="colorScheme"
                  value={scheme.value}
                  checked={config.colorScheme === scheme.value}
                  onChange={(e) => onChange({ colorScheme: e.target.value })}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${scheme.color}`}></div>
                  <span className="text-sm font-medium text-gray-900">
                    {scheme.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      {/* Quick Tips */}
      <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Quick Tips</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Use categorical data for X-axis (names, dates, categories)</li>
          <li>• Use numeric data for Y-axis (amounts, counts, percentages)</li>
          <li>• Try different chart types to find the best visualization</li>
          <li>• Scatter plots work best with two numeric columns</li>
        </ul>
      </div>
    </Card>
  );
};

export default ChartControls;