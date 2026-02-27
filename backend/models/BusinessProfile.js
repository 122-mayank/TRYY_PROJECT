const mongoose = require('mongoose');

const businessProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  businessDetails: {
    name: String,
    description: String,
    industry: String,
    subIndustry: String,
    founded: Date,
    website: String,
    socialMedia: {
      facebook: String,
      instagram: String,
      linkedin: String,
      twitter: String,
      tiktok: String
    }
  },
  productDetails: [{
    name: String,
    category: String,
    price: Number,
    averageOrderValue: Number,
    customerLifetimeValue: Number,
    margin: Number
  }],
  targetMarket: {
    demographics: {
      ageGroups: [String],
      genders: [String],
      incomeLevels: [String],
      educationLevels: [String],
      occupations: [String]
    },
    psychographics: {
      interests: [String],
      behaviors: [String],
      values: [String]
    },
    geography: {
      countries: [String],
      cities: [String],
      radius: Number,
      language: [String]
    }
  },
  competitors: [{
    name: String,
    website: String,
    platforms: [String],
    estimatedTraffic: Number
  }],
  marketingGoals: {
    primary: {
      type: String,
      enum: ['brand_awareness', 'lead_generation', 'sales', 'customer_retention']
    },
    kpis: [{
      metric: String,
      target: Number,
      timeframe: String
    }],
    budget: {
      monthly: Number,
      total: Number,
      currency: String
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BusinessProfile', businessProfileSchema);