import React, { useState, useEffect } from 'react';
import {
  UserIcon,
  MailIcon,
  ShieldCheckIcon,
  KeyIcon,
  ClockIcon,
  ChartBarIcon,
  CogIcon,
  RefreshIcon,
  SaveIcon
} from '@heroicons/react/outline';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminProfile = () => {
  const [adminData, setAdminData] = useState({
    id: '',
    email: '',
    name: '',
    role: 'admin',
    permissions: [],
    lastLogin: '',
    createdAt: '',
    twoFactorEnabled: false,
    apiKeys: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [auditLogs, setAuditLogs] = useState([]);
  const [systemStats, setSystemStats] = useState({});

  useEffect(() => {
    fetchAdminProfile();
    fetchAuditLogs();
    fetchSystemStats();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await api.get('/admin/profile');
      setAdminData(response.data);
    } catch (error) {
      console.error('Error fetching admin profile:', error);
      toast.error('Failed to load profile');
      
      // Mock data for demo
      setAdminData({
        id: 'ADM001',
        email: 'admin@adviser.com',
        name: 'Super Admin',
        role: 'super_admin',
        permissions: [
          'manage_users',
          'manage_platforms',
          'manage_billing',
          'view_analytics',
          'manage_models',
          'system_config'
        ],
        lastLogin: '2024-02-26 10:30 AM',
        createdAt: '2024-01-01',
        twoFactorEnabled: true,
        apiKeys: [
          { name: 'Production API Key', key: 'sk_live_••••••••••••••••', lastUsed: '2024-02-26' },
          { name: 'Development Key', key: 'sk_test_••••••••••••••••', lastUsed: '2024-02-25' }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    // Mock audit logs
    setAuditLogs([
      {
        id: 1,
        action: 'User deleted',
        user: 'john@example.com',
        timestamp: '2024-02-26 09:15 AM',
        ip: '192.168.1.100'
      },
      {
        id: 2,
        action: 'Model retrained',
        user: 'admin@adviser.com',
        timestamp: '2024-02-26 08:30 AM',
        ip: '192.168.1.101'
      },
      {
        id: 3,
        action: 'Platform settings updated',
        user: 'admin@adviser.com',
        timestamp: '2024-02-25 11:20 PM',
        ip: '192.168.1.102'
      },
      {
        id: 4,
        action: 'New admin added',
        user: 'super@adviser.com',
        timestamp: '2024-02-25 04:15 PM',
        ip: '192.168.1.103'
      },
      {
        id: 5,
        action: 'System backup completed',
        user: 'system',
        timestamp: '2024-02-25 02:00 AM',
        ip: '127.0.0.1'
      }
    ]);
  };

  const fetchSystemStats = async () => {
    setSystemStats({
      totalUsers: 1250,
      activeToday: 342,
      totalCampaigns: 2340,
      apiCalls: 45200,
      avgResponseTime: '124ms',
      uptime: '99.98%',
      memoryUsage: '4.2GB / 8GB',
      cpuLoad: '32%'
    });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.put('/admin/profile', adminData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerateKey = (keyName) => {
    toast.success(`New API key generated for ${keyName}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <ShieldCheckIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Profile</h1>
              <p className="text-purple-200 mt-1">Manage your administrator account and system settings</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile Details
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'security'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Security & API
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'audit'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Audit Logs
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'system'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              System Stats
            </button>
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Administrator Information</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={adminData.name}
                      onChange={(e) => setAdminData({...adminData, name: e.target.value})}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <MailIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={adminData.email}
                      onChange={(e) => setAdminData({...adminData, email: e.target.value})}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin ID
                  </label>
                  <input
                    type="text"
                    value={adminData.id}
                    disabled
                    className="input-field bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={adminData.role.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                    disabled
                    className="input-field bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Login
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      <ClockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={adminData.lastLogin}
                      disabled
                      className="input-field pl-10 bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Created
                  </label>
                  <input
                    type="text"
                    value={adminData.createdAt}
                    disabled
                    className="input-field bg-gray-50"
                  />
                </div>
              </div>

              {/* Permissions */}
              <div className="mt-8">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Admin Permissions</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {adminData.permissions.map((perm, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">
                        {perm.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  <SaveIcon className="h-5 w-5 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Two Factor Authentication */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    <p className="text-sm font-medium mt-2">
                      Status: {adminData.twoFactorEnabled ? 
                        <span className="text-green-600">Enabled</span> : 
                        <span className="text-red-600">Disabled</span>}
                    </p>
                  </div>
                  <button
                    className={`px-4 py-2 rounded-lg ${
                      adminData.twoFactorEnabled
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {adminData.twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
                  </button>
                </div>
              </div>
            </div>

            {/* API Keys */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">API Keys</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {adminData.apiKeys.map((apiKey, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{apiKey.name}</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Key: {apiKey.key}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Last used: {apiKey.lastUsed}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRegenerateKey(apiKey.name)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                        >
                          <RefreshIcon className="h-4 w-4 mr-1" />
                          Regenerate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="mt-4 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <KeyIcon className="h-5 w-5 mr-2" />
                  Generate New API Key
                </button>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input type="password" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input type="password" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input type="password" className="input-field" />
                  </div>
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audit Logs Tab */}
        {activeTab === 'audit' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Admin Activities</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.action}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.timestamp}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* System Stats Tab */}
        {activeTab === 'system' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">System Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Users:</span>
                  <span className="font-semibold">{systemStats.totalUsers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Today:</span>
                  <span className="font-semibold text-green-600">{systemStats.activeToday}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Campaigns:</span>
                  <span className="font-semibold">{systemStats.totalCampaigns}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">API Calls (24h):</span>
                  <span className="font-semibold">{systemStats.apiCalls}</span>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Response:</span>
                  <span className="font-semibold text-green-600">{systemStats.avgResponseTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uptime:</span>
                  <span className="font-semibold text-green-600">{systemStats.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CPU Load:</span>
                  <span className="font-semibold">{systemStats.cpuLoad}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Memory:</span>
                  <span className="font-semibold">{systemStats.memoryUsage}</span>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100">
                  <CogIcon className="h-5 w-5 inline mr-2" />
                  System Configuration
                </button>
                <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
                  <ChartBarIcon className="h-5 w-5 inline mr-2" />
                  View Full Analytics
                </button>
                <button className="w-full text-left px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100">
                  <RefreshIcon className="h-5 w-5 inline mr-2" />
                  Retrain ML Models
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;