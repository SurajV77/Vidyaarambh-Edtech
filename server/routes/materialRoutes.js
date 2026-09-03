const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { verifyToken, isAdmin } = require('../middleware/auth');
const {
  uploadMaterial,
  getMaterials,
  deleteMaterial,
} = require('../controllers/materialController');

// Get materials (both Admin and Student)
router.get('/', verifyToken, getMaterials);

// Upload PDF (Admin only)
router.post('/upload', verifyToken, isAdmin, upload.single('file'), uploadMaterial);

// Delete PDF (Admin only)
router.delete('/:id', verifyToken, isAdmin, deleteMaterial);

module.exports = router;
