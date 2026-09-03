const express = require('express');
const router = express.Router();
const { getPublicStats } = require('../controllers/publicController');

// Public route to fetch real academic stats for landing page (no auth needed)
router.get('/stats', getPublicStats);

module.exports = router;
