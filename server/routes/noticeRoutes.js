const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const {
  createNotice,
  getNotices,
  deleteNotice,
} = require('../controllers/noticeController');

// All authenticated users can view notices
router.get('/', verifyToken, getNotices);

// Admin only can create or delete notices
router.post('/', verifyToken, isAdmin, createNotice);
router.delete('/:id', verifyToken, isAdmin, deleteNotice);

module.exports = router;
