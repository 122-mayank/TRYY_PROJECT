import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { SaveIcon } from '@heroicons/react/outline';

const BusinessProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    businessDetails: {
      name: '',
      description: '',
      industry: '',
      website: '',
    },
    targetMarket: {
      demographics: {
        ageGroups: [],
        genders: [],
        incomeLevels: [],
      },
      geography: {
        countries: [],
        language: [],
      },
    },
    marketingGoals: {
      primary: 'brand_awareness',
      budget: {
        monthly: 5000,
        currency: 'USD',
      },
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/business/profile');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/business/profile', profile);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (section, field, value) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const industries = [
    'Technology',
    'E-commerce',
    'Healthcare',
    'Finance',
    'Education',
    'Real Estate',
    'Travel',
    'Food & Beverage',
    'Fashion',
    'Automotive',
    'Other'
  ];

  const ageGroups = ['18-24', '25-34', '35-44', '45-54', '55+'];
  const genders = ['Male', 'Female', 'All'];
  const incomeLevels = ['0-25k', '25k-50k', '50k-100k', '100k+'];
  const countries = ['USA', 'Canada', 'UK', 'Australia', 'India', 'Germany', 'France'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Hindi', 'Chinese'];
  const goals = ['brand_awareness', 'lead_generation', 'sales', 'customer_retention'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Business Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Update your business information for better recommendations
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Business Details */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={profile.businessDetails.name}
                  onChange={(e) => handleChange('businessDetails', 'name', e.target.value)}
                  className="input-field"
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={profile.businessDetails.industry}
                  onChange={(e) => handleChange('businessDetails', 'industry', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select Industry</option>
                  {industries.map(ind => (
                    <option key={ind} value={ind.toLowerCase()}>{ind}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Description
                </label>
                <textarea
                  value={profile.businessDetails.description}
                  onChange={(e) => handleChange('businessDetails', 'description', e.target.value)}
                  rows="3"
                  className="input-field"
                  placeholder="Describe your business..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={profile.businessDetails.website}
                  onChange={(e) => handleChange('businessDetails', 'website', e.target.value)}
                  className="input-field"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Target Market */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Target Market</h2>
            
            <div className="space-y-6">
              {/* Demographics */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Demographics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age Groups
                    </label>
                    <select
                      multiple
                      value={profile.targetMarket.demographics.ageGroups}
                      onChange={(e) => handleChange('targetMarket.demographics', 'ageGroups', 
                        Array.from(e.target.selectedOptions, option => option.value))}
                      className="input-field h-32"
                    >
                      {ageGroups.map(age => (
                        <option key={age} value={age}>{age}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Genders
                    </label>
                    <select
                      multiple
                      value={profile.targetMarket.demographics.genders}
                      onChange={(e) => handleChange('targetMarket.demographics', 'genders',
                        Array.from(e.target.selectedOptions, option => option.value))}
                      className="input-field h-32"
                    >
                      {genders.map(gender => (
                        <option key={gender} value={gender.toLowerCase()}>{gender}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Income Levels
                    </label>
                    <select
                      multiple
                      value={profile.targetMarket.demographics.incomeLevels}
                      onChange={(e) => handleChange('targetMarket.demographics', 'incomeLevels',
                        Array.from(e.target.selectedOptions, option => option.value))}
                      className="input-field h-32"
                    >
                      {incomeLevels.map(income => (
                        <option key={income} value={income}>{income}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Geography */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Geography</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Countries
                    </label>
                    <select
                      multiple
                      value={profile.targetMarket.geography.countries}
                      onChange={(e) => handleChange('targetMarket.geography', 'countries',
                        Array.from(e.target.selectedOptions, option => option.value))}
                      className="input-field h-32"
                    >
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Languages
                    </label>
                    <select
                      multiple
                      value={profile.targetMarket.geography.language}
                      onChange={(e) => handleChange('targetMarket.geography', 'language',
                        Array.from(e.target.selectedOptions, option => option.value))}
                      className="input-field h-32"
                    >
                      {languages.map(lang => (
                        <option key={lang} value={lang.toLowerCase()}>{lang}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Marketing Goals */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Marketing Goals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Goal
                </label>
                <select
                  value={profile.marketingGoals.primary}
                  onChange={(e) => handleChange('marketingGoals', 'primary', e.target.value)}
                  className="input-field"
                >
                  {goals.map(goal => (
                    <option key={goal} value={goal}>
                      {goal.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Budget (USD)
                </label>
                <input
                  type="number"
                  value={profile.marketingGoals.budget.monthly}
                  onChange={(e) => handleChange('marketingGoals.budget', 'monthly', parseInt(e.target.value))}
                  className="input-field"
                  min="0"
                  step="1000"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <SaveIcon className="h-5 w-5 mr-2" />
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessProfile;