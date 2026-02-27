const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const BusinessProfile = require('../models/BusinessProfile');

// Create or update business profile
router.post('/profile', auth, async (req, res) => {
  try {
    const profileData = {
      userId: req.user._id,
      businessDetails: req.body.businessDetails,
      productDetails: req.body.productDetails,
      targetMarket: req.body.targetMarket,
      competitors: req.body.competitors,
      marketingGoals: req.body.marketingGoals
    };

    const profile = await BusinessProfile.findOneAndUpdate(
      { userId: req.user._id },
      profileData,
      { new: true, upsert: true, runValidators: true }
    );

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get business profile
router.get('/profile', auth, async (req, res) => {
  try {
    const profile = await BusinessProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;