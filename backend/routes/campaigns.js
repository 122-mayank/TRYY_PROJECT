const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// Create campaign
router.post('/', auth, async (req, res) => {
  try {
    const campaign = req.body;
    // Save to database logic here
    res.status(201).json({ 
      message: 'Campaign created',
      campaign: {
        id: Date.now().toString(),
        ...campaign,
        userId: req.user._id,
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user campaigns
router.get('/', auth, async (req, res) => {
  try {
    // Fetch from database logic here
    res.json([
      {
        id: '1',
        name: 'Summer Sale 2024',
        platform: 'google_ads',
        budget: 5000,
        status: 'active',
        performance: {
          impressions: 125400,
          clicks: 3245,
          conversions: 234,
          spend: 3240.50
        }
      }
    ]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;