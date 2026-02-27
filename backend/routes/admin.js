const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

// Get analytics overview
router.get('/overview', auth, async (req, res) => {
  try {
    res.json({
      totalSpend: 15420.50,
      totalImpressions: 1250000,
      totalClicks: 45200,
      totalConversions: 3450,
      averageROAS: 3.8,
      period: 'last_30_days'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get performance by platform
router.get('/by-platform', auth, async (req, res) => {
  try {
    res.json([
      { platform: 'Google Ads', spend: 5420, conversions: 1234, roas: 3.2 },
      { platform: 'Facebook', spend: 3800, conversions: 890, roas: 2.8 },
      { platform: 'LinkedIn', spend: 4200, conversions: 567, roas: 4.5 }
    ]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;