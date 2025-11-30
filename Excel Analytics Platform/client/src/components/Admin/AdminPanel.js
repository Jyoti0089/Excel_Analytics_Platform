import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Card from '../UI/Card';
import Button from '../UI/Button';
import LoadingSpinner from '../UI/LoadingSpinner';
import Alert from '../UI/Alert';
import Modal from '../UI/Modal';
import {
  UsersIcon,
  DocumentChartBarIcon,
  ChartBarIcon,
  ServerIcon,
  ShieldCheckIcon,
  UserIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});
  const [error, setError] = useState('');
  const [roleModal, setRoleModal] = useState({ open: false, user: null });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        axios.get('/api/admin/dashboard'),
        axios.get('/api/admin/users')
      ]);

      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users || []);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      setError('Failed to load admin data. Please try again.');
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const confirmRoleChange = (user) => {
    setRoleModal({ open: true, user });
  };

  const updateUserRole = async () => {
    const { user } = roleModal;
    if (!user) return;

    const newRole = !user.isAdmin;
    setUpdating(prev => ({ ...prev, [user._id]: true }));

    try {
      await axios.put('/api/admin/users/role', { 
        userId: user._id, 
        isAdmin: newRole 
      });
      
      setUsers(prev => 
        prev.map(u => 
          u._id === user._id ? { ...u, isAdmin: newRole } : u
        )
      );
      
      toast.success(`User role updated to ${newRole ? 'Admin' : 'User'} successfully`);
    } catch (error) {
      console.error('Failed to update user role:', error);
      toast.error('Failed to update user role');
    } finally {
      setUpdating(prev => ({ ...prev, [user._id]: false }));
      setRoleModal({ open: false, user: null });
    }
  };

  const getRoleChangeText = (user) => {
    return user?.isAdmin ? 'Remove Admin Rights' : 'Grant Admin Rights';
  };

  const getRoleChangeDescription = (user) => {
    return user?.isAdmin 
      ? 'This will remove admin privileges from this user. They will only have standard user access.'
      : 'This will grant admin privileges to this user. They will be able to manage all users and system settings.';
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading admin panel..." />;
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
  <div className="px-4 py-6 sm:px-0">
    {/* Header */}
    <div className="mb-8">
      <div className="flex items-center mb-2">
        <ShieldCheckIcon className="h-8 w-8 text-purple-600 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
      </div>
      <p className="text-gray-600">
        Manage users, monitor system usage, and oversee platform operations
      </p>
    </div>

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
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="transition-all duration-200 hover:shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <UsersIcon className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  <p className="text-xs text-blue-600 mt-1">Registered accounts</p>
                </div>
              </div>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-green-100 rounded-lg p-3">
                    <DocumentChartBarIcon className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Uploads</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUploads}</p>
                  <p className="text-xs text-green-600 mt-1">Files processed</p>
                </div>
              </div>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-purple-100 rounded-lg p-3">
                    <ChartBarIcon className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Analyses</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalAnalyses}</p>
                  <p className="text-xs text-purple-600 mt-1">Charts created</p>
                </div>
              </div>
            </Card>

            <Card className="transition-all duration-200 hover:shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="bg-orange-100 rounded-lg p-3">
                    <ServerIcon className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">System Status</p>
                  <p className="text-2xl font-bold text-green-600">Healthy</p>
                  <p className="text-xs text-orange-600 mt-1">All systems operational</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* User Management */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage user accounts and permissions ({users.length} total users)
              </p>
            </div>
            <Button 
              onClick={fetchAdminData}
              variant="outline"
              size="sm"
            >
              Refresh Data
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-medium text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">ID: {user._id.slice(-8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        user.isAdmin 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.isAdmin ? (
                          <>
                            <ShieldCheckIcon className="h-3 w-3 mr-1" />
                            Admin
                          </>
                        ) : (
                          <>
                            <UserIcon className="h-3 w-3 mr-1" />
                            User
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(user.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        size="sm"
                        variant={user.isAdmin ? "secondary" : "primary"}
                        onClick={() => confirmRoleChange(user)}
                        loading={updating[user._id]}
                        className="flex items-center"
                      >
                        {user.isAdmin ? (
                          <>
                            <UserIcon className="h-4 w-4 mr-1" />
                            Remove Admin
                          </>
                        ) : (
                          <>
                            <ShieldCheckIcon className="h-4 w-4 mr-1" />
                            Make Admin
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
                           </tbody>
            </table>
          </div>
        </Card>

        {/* Role Change Modal */}
        <Modal
          open={roleModal.open}
          onClose={() => setRoleModal({ open: false, user: null })}
          title={getRoleChangeText(roleModal.user)}
          icon={<ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />}
        >
          <div className="mb-4">
            <p className="text-gray-700">{getRoleChangeDescription(roleModal.user)}</p>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setRoleModal({ open: false, user: null })}
            >
              Cancel
            </Button>
            <Button
              variant={roleModal.user?.isAdmin ? "danger" : "primary"}
              onClick={updateUserRole}
              loading={updating[roleModal.user?._id]}
            >
              {getRoleChangeText(roleModal.user)}
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminPanel;