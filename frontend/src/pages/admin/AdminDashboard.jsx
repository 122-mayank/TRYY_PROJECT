import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

// Sirf wahi imports jo actually use ho rahe hain
import {
  UsersIcon,
  UserGroupIcon,
  UserIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CheckCircleIcon
} from '@heroicons/react/outline';  // v1 imports

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 2400,
    activeUsers: 1800,
    totalCampaigns: 320,
    revenue: 125000,
    modelAccuracy: 94,
  });

  const [users] = useState([
    { id: 1, name: 'TechStart Inc', email: 'tech@start.com', company: 'TechStart Solutions', plan: 'Enterprise', status: 'active', spent: 12500, revenue: 45000 },
    { id: 2, name: 'Fashion Hub', email: 'fashion@hub.com', company: 'Fashion Hub Ltd', plan: 'Pro', status: 'active', spent: 8500, revenue: 28000 },
    { id: 3, name: 'SaaS Solutions', email: 'hello@saas.com', company: 'SaaS Innovations', plan: 'Enterprise', status: 'active', spent: 18700, revenue: 65000 },
  ]);

  const [userFilter, setUserFilter] = useState('all');

  // Mock data
  const userGrowthData = [
    { month: 'Jan', users: 400 },
    { month: 'Feb', users: 600 },
    { month: 'Mar', users: 800 },
    { month: 'Apr', users: 1200 },
    { month: 'May', users: 1800 },
    { month: 'Jun', users: 2400 },
  ];

  const platformSuccessData = [
    { name: 'Google Ads', success: 85, color: '#4285F4' },
    { name: 'Facebook', success: 78, color: '#4267B2' },
    { name: 'LinkedIn', success: 92, color: '#0077B5' },
    { name: 'TikTok', success: 71, color: '#000000' },
    { name: 'Instagram', success: 88, color: '#E4405F' },
  ];

  const getFilteredUsers = () => {
    switch(userFilter) {
      case 'active':
        return users.filter(u => u.status === 'active');
      case 'enterprise':
        return users.filter(u => u.plan === 'Enterprise');
      default:
        return users;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <ShieldCheckIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-purple-200 mt-1">
                  Welcome back, Admin
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="/admin/profile" 
                className="flex items-center px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30"
              >
                <UserIcon className="h-5 w-5 mr-2" />
                Profile
              </a>
              <button className="px-4 py-2 bg-red-500 bg-opacity-80 rounded-lg hover:bg-opacity-100">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
              </div>
              <div className="bg-green-100 rounded-lg p-3">
                <UserGroupIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCampaigns}</p>
              </div>
              <div className="bg-purple-100 rounded-lg p-3">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-bold text-green-600">${stats.revenue.toLocaleString()}</p>
              </div>
              <div className="bg-yellow-100 rounded-lg p-3">
                <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">User Growth</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Platform Success Rates</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformSuccessData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="success" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-5 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Users</h3>
              
              {/* Filter Buttons */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setUserFilter('all')}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    userFilter === 'all' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setUserFilter('active')}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    userFilter === 'active' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setUserFilter('enterprise')}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    userFilter === 'enterprise' 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Enterprise
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getFilteredUsers().map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.plan === 'Enterprise' ? 'bg-purple-100 text-purple-800' :
                        user.plan === 'Pro' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="flex items-center">
                        <span className={`h-2 w-2 rounded-full mr-2 ${
                          user.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                        }`}></span>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${user.spent.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                      ${user.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <span className="ml-3 text-sm text-gray-600">
              TechStart Inc created a campaign on Google Ads
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;