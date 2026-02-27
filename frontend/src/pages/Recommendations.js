import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { LightBulbIcon, CheckCircleIcon, CurrencyDollarIcon, UsersIcon, TrendingUpIcon } from '@heroicons/react/outline';
import toast from 'react-hot-toast';

const Recommendations = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [darkHorse, setDarkHorse] = useState(null);
  const [budgetAllocation, setBudgetAllocation] = useState({});

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      // First get business profile
      const profileRes = await api.get('/business/profile');
      
      // Then get recommendations
      const recRes = await api.post('/recommendations', profileRes.data);
      
      setRecommendations(recRes.data.recommendations || []);
      setDarkHorse(recRes.data.darkHorse);
      setBudgetAllocation(recRes.data.budgetAllocation || {});
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Failed to fetch recommendations');
      
      // Mock data for demo
      setRecommendations([
        {
          platform: 'Google Ads',
          success_probability: 0.92,
          estimated_reach: 2500000,
          estimated_cac: 45.50,
          estimated_roas: 3.8,
          competition_level: 'Medium',
          audience_match: 0.88,
          reasons: ['High intent audience', 'Strong search presence', 'Cost effective']
        },
        {
          platform: 'LinkedIn',
          success_probability: 0.89,
          estimated_reach: 850000,
          estimated_cac: 75.20,
          estimated_roas: 4.2,
          competition_level: 'High',
          audience_match: 0.95,
          reasons: ['B2B focused', 'Professional network', 'Decision makers']
        },
        {
          platform: 'Facebook',
          success_probability: 0.78,
          estimated_reach: 3500000,
          estimated_cac: 32.50,
          estimated_roas: 2.9,
          competition_level: 'High',
          audience_match: 0.75,
          reasons: ['Broad reach', 'Detailed targeting', 'Retargeting options']
        },
        {
          platform: 'TikTok',
          success_probability: 0.71,
          estimated_reach: 4200000,
          estimated_cac: 28.80,
          estimated_roas: 2.5,
          competition_level: 'Medium',
          audience_match: 0.68,
          reasons: ['Viral potential', 'Young audience', 'Creative formats']
        }
      ]);
      
      setDarkHorse({
        platform: 'Reddit',
        success_probability: 0.65,
        estimated_reach: 450000,
        estimated_cac: 22.50,
        estimated_roas: 3.2,
        competition_level: 'Low',
        audience_match: 0.71,
        reasons: ['Niche communities', 'Authentic engagement', 'Lower CPC']
      });
      
      setBudgetAllocation({
        'Google Ads': 5000,
        'LinkedIn': 3500,
        'Facebook': 2500,
        'TikTok': 2000,
        'Reddit': 1000
      });
    } finally {
      setLoading(false);
    }
  };

  const getPlatformColor = (platform) => {
    const colors = {
      'Google Ads': 'bg-blue-500',
      'LinkedIn': 'bg-blue-700',
      'Facebook': 'bg-indigo-600',
      'TikTok': 'bg-black',
      'Reddit': 'bg-orange-500',
      'Instagram': 'bg-pink-600',
      'Twitter': 'bg-sky-400',
      'Pinterest': 'bg-red-600'
    };
    return colors[platform] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Analyzing your business data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">AI-Powered Recommendations</h1>
          <p className="text-xl text-blue-100">
            Based on your business profile, we've identified the best platforms for your advertising campaigns.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Budget Allocation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recommended Budget Allocation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(budgetAllocation).map(([platform, amount], index) => (
              <div key={platform} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">{platform}</span>
                  <div className={`w-3 h-3 rounded-full ${getPlatformColor(platform)}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">${amount.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {((amount / Object.values(budgetAllocation).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}% of total
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Recommendations */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Recommended Platforms</h2>
        
        <div className="space-y-6">
          {recommendations.map((rec, index) => (
            <div key={rec.platform} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg ${getPlatformColor(rec.platform)} flex items-center justify-center text-white font-bold text-xl`}>
                      {rec.platform.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{rec.platform}</h3>
                      <div className="flex items-center mt-1 space-x-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          rec.competition_level === 'High' ? 'bg-red-100 text-red-800' :
                          rec.competition_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {rec.competition_level} Competition
                        </span>
                        <span className="text-sm text-gray-500">
                          Audience Match: {(rec.audience_match * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      {(rec.success_probability * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-500">Success Probability</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <UsersIcon className="h-4 w-4 mr-1" />
                      Reach
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {(rec.estimated_reach / 1000000).toFixed(1)}M
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      Est. CAC
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      ${rec.estimated_cac.toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <TrendingUpIcon className="h-4 w-4 mr-1" />
                      Est. ROAS
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {rec.estimated_roas.toFixed(1)}x
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      Budget
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      ${budgetAllocation[rec.platform]?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Why this platform?</h4>
                  <div className="flex flex-wrap gap-2">
                    {rec.reasons.map((reason, i) => (
                      <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        {reason}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Create Campaign
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dark Horse Recommendation */}
        {darkHorse && (
          <div className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center space-x-2 mb-4">
              <LightBulbIcon className="h-6 w-6" />
              <h2 className="text-xl font-bold">Dark Horse Opportunity</h2>
            </div>
            <p className="text-purple-100 mb-4">
              While not obvious, we've detected a unique opportunity that your competitors might be missing.
            </p>
            
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{darkHorse.platform}</h3>
                  <div className="flex space-x-4">
                    <span className="text-purple-200">
                      Success: {(darkHorse.success_probability * 100).toFixed(0)}%
                    </span>
                    <span className="text-purple-200">
                      Est. CAC: ${darkHorse.estimated_cac.toFixed(2)}
                    </span>
                    <span className="text-purple-200">
                      Est. ROAS: {darkHorse.estimated_roas.toFixed(1)}x
                    </span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
                  Explore
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;