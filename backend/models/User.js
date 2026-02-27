const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  companyName: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'premium'],
    default: 'user'
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free'
    },
    expiresAt: Date,
    features: [String]
  },
  profile: {
    industry: String,
    website: String,
    companySize: String,
    annualRevenue: String,
    targetAudience: {
      ageRange: [Number],
      gender: [String],
      locations: [String],
      interests: [String]
    }
  },
  apiKeys: [{
    platform: String,
    key: String,
    status: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);