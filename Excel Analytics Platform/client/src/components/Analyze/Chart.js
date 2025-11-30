import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line, Pie, Doughnut, Scatter } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Chart = ({ data, config }) => {
  const chartRef = useRef();

  useEffect(() => {
    // Add event listener for download functionality
    const handleDownload = () => {
      if (chartRef.current) {
        const link = document.createElement('a');
        link.download = `chart-${Date.now()}.png`;
        link.href = chartRef.current.toBase64Image();
        link.click();
      }
    };

    window.addEventListener('downloadChart', handleDownload);
    return () => window.removeEventListener('downloadChart', handleDownload);
  }, []);

  const getColorScheme = (scheme, dataLength) => {
    const schemes = {
      blue: [
        '#3B82F6', '#1D4ED8', '#1E40AF', '#1E3A8A', '#172554',
        '#60A5FA', '#93C5FD', '#BFDBFE', '#DBEAFE', '#EFF6FF'
      ],
      green: [
        '#10B981', '#059669', '#047857', '#065F46', '#064E3B',
        '#34D399', '#6EE7B7', '#9DECCD', '#C6F6D5', '#D1FAE5'
      ],
      red: [
        '#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D',
        '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2', '#FEF2F2'
      ],
      purple: [
        '#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95',
        '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE', '#F5F3FF'
      ],
      rainbow: [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#F9CA24', '#F0932B',
        '#EB4D4B', '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E'
      ]
    };
    
    const colors = schemes[scheme] || schemes.blue;
    const result = [];
    
    for (let i = 0; i < dataLength; i++) {
      result.push(colors[i % colors.length]);
    }
    
    return result;
  };

  const prepareChartData = () => {
    if (!data || !config.xAxis || !config.yAxis) return null;

    // For scatter plot, we need different data structure
    if (config.type === 'scatter') {
      const scatterData = data.map((row, index) => ({
        x: Number(row[config.xAxis]) || 0,
        y: Number(row[config.yAxis]) || 0,
        label: row[config.xAxis] || `Point ${index + 1}`
      }));

      return {
        datasets: [{
          label: `${config.yAxis} vs ${config.xAxis}`,
          data: scatterData,
          backgroundColor: getColorScheme(config.colorScheme, 1)[0] + '80',
          borderColor: getColorScheme(config.colorScheme, 1)[0],
          borderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        }]
      };
    }

    // For pie and doughnut charts, group data by X axis
    if (config.type === 'pie' || config.type === 'doughnut') {
      const groupedData = {};
      data.forEach(row => {
        const key = String(row[config.xAxis] || 'Unknown');
        const value = Number(row[config.yAxis]) || 0;
        groupedData[key] = (groupedData[key] || 0) + value;
      });

      const labels = Object.keys(groupedData);
      const values = Object.values(groupedData);
      const colors = getColorScheme(config.colorScheme, labels.length);

      return {
        labels,
        datasets: [{
          label: config.yAxis,
          data: values,
          backgroundColor: colors.map(color => color + '80'),
          borderColor: colors,
          borderWidth: 2,
          hoverBackgroundColor: colors,
          hoverBorderWidth: 3
        }]
      };
    }

    // For bar and line charts
    const labels = data.map(row => String(row[config.xAxis] || ''));
    const values = data.map(row => Number(row[config.yAxis]) || 0);
    const colors = getColorScheme(config.colorScheme, values.length);

    return {
      labels,
      datasets: [{
        label: config.yAxis,
        data: values,
        backgroundColor: config.type === 'line' 
          ? colors[0] + '20' 
          : colors.map(color => color + '80'),
        borderColor: config.type === 'line' ? colors[0] : colors,
        borderWidth: 2,
        tension: config.type === 'line' ? 0.4 : 0,
        fill: config.type === 'line',
        pointBackgroundColor: config.type === 'line' ? colors[0] : undefined,
        pointBorderColor: config.type === 'line' ? colors[0] : undefined,
        pointRadius: config.type === 'line' ? 4 : undefined,
        pointHoverRadius: config.type === 'line' ? 6 : undefined,
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: false,
      },
      legend: {
        display: config.type === 'pie' || config.type === 'doughnut',
        position: 'right',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function(context) {
            if (config.type === 'scatter') {
              return context[0].parsed.label || `${config.xAxis}: ${context[0].parsed.x}`;
            }
            return context[0].label;
          },
          label: function(context) {
            if (config.type === 'scatter') {
              return `${config.yAxis}: ${context.parsed.y}`;
            }
            const value = typeof context.parsed === 'object' 
              ? (context.parsed.y !== undefined ? context.parsed.y : context.parsed)
              : context.parsed;
            return `${context.dataset.label}: ${value?.toLocaleString()}`;
          }
        }
      }
    },
    scales: config.type !== 'pie' && config.type !== 'doughnut' ? {
      x: {
        title: {
          display: true,
          text: config.xAxis,
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          maxRotation: 45,
          font: {
            size: 11
          }
        }
      },
      y: {
        title: {
          display: true,
          text: config.yAxis,
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return value.toLocaleString();
          },
          font: {
            size: 11
          }
        }
      }
    } : {},
    elements: {
      point: {
        hoverBackgroundColor: 'white',
        hoverBorderWidth: 2,
      }
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart'
    }
  };

  const chartData = prepareChartData();

  if (!chartData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-200 h-12 w-12 mb-4"></div>
          <p className="text-gray-500">Loading chart...</p>
        </div>
      </div>
    );
  }

  const ChartComponent = {
    bar: Bar,
    line: Line,
    pie: Pie,
    doughnut: Doughnut,
    scatter: Scatter
  }[config.type] || Bar;

  return (
    <div className="w-full h-full">
      <ChartComponent
        ref={chartRef}
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
};

export default Chart;
