import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../config'; // ✅ added live backend URL
import Card from '../UI/Card';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import Alert from '../UI/Alert';
import {
  CloudArrowUpIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentChartBarIcon,
  UsersIcon,
  ServerIcon,
  ArrowUpRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    recentUploads: [],
    recentAnalyses: [],
    totalUploads: 0,
    totalAnalyses: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // ✅ Updated API calls to use live backend URL
      const [uploadsRes, analysesRes] = await Promise.all([
        axios.get(`${API_URL}/api/upload`),
        axios.get(`${API_URL}/api/analysis`)
      ]);

      setStats({
        recentUploads: uploadsRes.data.uploads?.slice(0, 5) || [],
        recentAnalyses: analysesRes.data.analyses?.slice(0, 5) || [],
        totalUploads: uploadsRes.data.uploads?.length || 0,
        totalAnalyses: analysesRes.data.analyses?.length || 0
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      name: 'Upload File',
      description: 'Upload a new Excel file for analysis',
      href: '/upload',
      icon: CloudArrowUpIcon,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      name: 'Create Chart',
      description: 'Analyze your data with interactive charts',
      href: '/analyze',
      icon: ChartBarIcon,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      name: 'View History',
      description: 'Browse your saved analyses',
      href: '/history',
      icon: ClockIcon,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    }
  ];

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading dashboard..." />;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your Excel analytics today.
          </p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="transition-all duration-200 hover:shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-blue-100 rounded-lg p-3">
                  <DocumentChartBarIcon className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Uploads</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUploads}</p>
                <p className="text-xs text-gray-400 mt-1">Excel files processed</p>
              </div>
            </div>
          </Card>
          
          <Card className="transition-all duration-200 hover:shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-green-100 rounded-lg p-3">
                  <ChartBarIcon className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Analyses</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalAnalyses}</p>
                <p className="text-xs text-gray-400 mt-1">Charts created</p>
              </div>
            </div>
          </Card>
          
          <Card className="transition-all duration-200 hover:shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-purple-100 rounded-lg p-3">
                  <ServerIcon className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Account Type</p>
                <p className="text-2xl font-bold text-gray-900">
                  {user?.isAdmin ? 'Admin' : 'User'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {user?.isAdmin ? 'Full access' : 'Standard access'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            <div className="text-sm text-gray-500">Get started with your data</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => (
              <Link key={action.name} to={action.href} className="group">
                <Card hover className="h-full transition-all duration-200 group-hover:scale-105">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 ${action.color} ${action.hoverColor} rounded-lg p-3 transition-colors duration-200`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                          {action.name}
                        </h3>
                        <ArrowUpRightIcon className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {/* ...rest of your original code remains unchanged... */}

      </div>
    </div>
  );
};

export default Dashboard;