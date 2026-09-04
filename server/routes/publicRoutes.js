const express = require('express');
const router = express.Router();
const { getPublicStats, getPublicStandards } = require('../controllers/publicController');

// Public route to fetch real academic stats for landing page (no auth needed)
router.get('/stats', getPublicStats);

// Public route to fetch active academic standards
router.get('/standards', getPublicStandards);

module.exports = router;
