import React, { useMemo } from 'react';
import Card from '../UI/Card';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EqualsIcon 
} from '@heroicons/react/24/outline';

const DataInsights = ({ data, xAxis, yAxis }) => {
  const insights = useMemo(() => {
    if (!data || !yAxis) return null;

    const yAxisData = data
      .map(row => Number(row[yAxis]))
      .filter(val => !isNaN(val) && val !== null);

    if (yAxisData.length === 0) return null;

    const sum = yAxisData.reduce((a, b) => a + b, 0);
    const average = sum / yAxisData.length;
    const sortedData = [...yAxisData].sort((a, b) => a - b);
    const maximum = sortedData[sortedData.length - 1];
    const minimum = sortedData[0];
    const range = maximum - minimum;
    
    // Calculate median
    const median = sortedData.length % 2 === 0
      ? (sortedData[sortedData.length / 2 - 1] + sortedData[sortedData.length / 2]) / 2
      : sortedData[Math.floor(sortedData.length / 2)];

    // Calculate quartiles
    const q1Index = Math.floor(sortedData.length * 0.25);
    const q3Index = Math.floor(sortedData.length * 0.75);
    const q1 = sortedData[q1Index];
    const q3 = sortedData[q3Index];

    // Find trends if xAxis is provided
    let trend = null;
    if (xAxis && data.length > 1) {
      const firstHalf = yAxisData.slice(0, Math.floor(yAxisData.length / 2));
      const secondHalf = yAxisData.slice(Math.floor(yAxisData.length / 2));
      
      const firstHalfAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const secondHalfAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      
      const changePercent = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
      
      if (Math.abs(changePercent) > 5) {
        trend = {
          direction: changePercent > 0 ? 'up' : 'down',
          change: Math.abs(changePercent).toFixed(1)
        };
      }
    }

    return {
      count: yAxisData.length,
      sum: sum.toFixed(2),
      average: average.toFixed(2),
      median: median.toFixed(2),
      maximum,
      minimum,
      range: range.toFixed(2),
      q1: q1.toFixed(2),
      q3: q3.toFixed(2),
      trend
    };
  }, [data, yAxis, xAxis]);

  if (!insights) return null;

  const stats = [
    { 
      label: 'Count', 
      value: insights.count.toLocaleString(),
      description: 'Total data points',
      icon: '🔢'
    },
    { 
      label: 'Sum', 
      value: Number(insights.sum).toLocaleString(),
      description: 'Total of all values',
      icon: '➕'
    },
    { 
      label: 'Average', 
      value: Number(insights.average).toLocaleString(),
      description: 'Mean value',
      icon: '📊'
    },
    { 
      label: 'Median', 
      value: Number(insights.median).toLocaleString(),
      description: 'Middle value',
      icon: '🎯'
    },
    { 
      label: 'Maximum', 
      value: insights.maximum.toLocaleString(),
      description: 'Highest value',
      icon: '⬆️'
    },
    { 
      label: 'Minimum', 
      value: insights.minimum.toLocaleString(),
      description: 'Lowest value',
      icon: '⬇️'
    },
    { 
      label: 'Range', 
      value: Number(insights.range).toLocaleString(),
      description: 'Max - Min',
      icon: '📏'
    }
  ];

  const getTrendIcon = () => {
    if (!insights.trend) return <EqualsIcon className="h-5 w-5 text-gray-500" />;
    return insights.trend.direction === 'up' 
      ? <ArrowTrendingUpIcon className="h-5 w-5 text-green-500" />
      : <ArrowTrendingDownIcon className="h-5 w-5 text-red-500" />;
  };

  const getTrendColor = () => {
    if (!insights.trend) return 'text-gray-600';
    return insights.trend.direction === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center mb-4">
          <ChartBarIcon className="h-5 w-5 text-indigo-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">
            Data Insights: {yAxis}
          </h3>
        </div>
        <div className="space-y-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-center">
                <span className="text-lg mr-2">{stat.icon}</span>
                <div>
                  <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </div>
              <span className="text-base font-semibold text-gray-900">{stat.value}</span>
            </div>
          ))}
          {/* Trend section */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
            <div className="flex items-center">
              {getTrendIcon()}
              <div className="ml-2">
                <span className="text-sm font-medium text-gray-700">Trend</span>
                <p className="text-xs text-gray-500">
                  {insights.trend
                    ? `Average ${insights.trend.direction === 'up' ? 'increased' : 'decreased'} by ${insights.trend.change}%`
                    : 'No significant trend'}
                </p>
              </div>
            </div>
            <span className={`text-base font-semibold ${getTrendColor()}`}>
              {insights.trend ? `${insights.trend.direction === 'up' ? '+' : '-'}${insights.trend.change}%` : '—'}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DataInsights;