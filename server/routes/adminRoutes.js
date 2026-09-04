const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const {
  getDashboardStats,
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  getFeeRecords,
  recordFeePayment,
  generateMonthlyFees,
  getStandards,
  createStandard,
  updateStandard,
  deleteStandard,
} = require('../controllers/adminController');

// All routes in this router require valid JWT and role === 'admin'
router.use(verifyToken, isAdmin);

// Dashboard metrics & revenue charts
router.get('/dashboard-stats', getDashboardStats);

// Student management
router.get('/students', getStudents);
router.post('/students', createStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);

// Fee & Revenue management
router.get('/fees', getFeeRecords);
router.post('/fees/pay', recordFeePayment);
router.post('/fees/generate-monthly', generateMonthlyFees);

// Academic Standards / Classes management
router.get('/standards', getStandards);
router.post('/standards', createStandard);
router.put('/standards/:id', updateStandard);
router.delete('/standards/:id', deleteStandard);

module.exports = router;
