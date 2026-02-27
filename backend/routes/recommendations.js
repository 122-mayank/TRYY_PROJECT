const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const axios = require('axios');

// Get recommendations
router.post('/', auth, async (req, res) => {
  try {
    // Call ML service
    const mlResponse = await axios.post(`${process.env.ML_SERVICE_URL}/api/recommendations`, {
      user_id: req.user._id.toString(),
      business_profile: req.body,
      include_dark_horse: true,
      num_recommendations: 10
    });

    res.json(mlResponse.data);
  } catch (error) {
    console.error('ML Service Error:', error.message);
    
    // Fallback response if ML service is unavailable
    res.json({
      recommendations: [
        {
          platform: 'google_ads',
          success_probability: 0.85,
          estimated_reach: 2500000,
          estimated_cac: 45.50,
          estimated_roas: 3.2,
          competition_level: 'Medium',
          audience_match: 0.78,
          reasons: ['High intent audience', 'Strong search presence']
        },
        {
          platform: 'linkedin',
          success_probability: 0.82,
          estimated_reach: 850000,
          estimated_cac: 75.20,
          estimated_roas: 4.1,
          competition_level: 'High',
          audience_match: 0.92,
          reasons: ['B2B focused', 'Professional network']
        }
      ],
      dark_horse: {
        platform: 'reddit',
        success_probability: 0.65,
        estimated_reach: 450000,
        estimated_cac: 32.80,
        estimated_roas: 2.8,
        competition_level: 'Low',
        audience_match: 0.71,
        reasons: ['Niche communities', 'Lower competition']
      },
      budget_allocation: {
        google_ads: 5000,
        linkedin: 3500,
        facebook: 2500
      },
      created_at: new Date().toISOString()
    });
  }
});

// Get saved recommendations
router.get('/saved', auth, async (req, res) => {
  try {
    // In a real app, you'd fetch from database
    res.json({ message: 'Saved recommendations endpoint' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;