const express = require('express');
const router = express.Router();
const { verifyToken, isStudent } = require('../middleware/auth');
const {
  getStudentDashboard,
  getMyFees,
  getMyMaterials,
} = require('../controllers/studentController');

// All student routes require valid token & student role
router.use(verifyToken, isStudent);

router.get('/dashboard', getStudentDashboard);
router.get('/fees', getMyFees);
router.get('/materials', getMyMaterials);

module.exports = router;
