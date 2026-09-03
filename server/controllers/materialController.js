const StudyMaterial = require('../models/StudyMaterial');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

// @desc    Upload Study Material PDF (Homework, Notes, Test)
// @route   POST /api/materials/upload
// @access  Private/Admin
exports.uploadMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No PDF file uploaded. Please select a valid PDF document.',
      });
    }

    const { title, description, category, targetClass, subject, dueDate, totalMarks } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title and category (HOMEWORK, NOTES, or TEST) are required.',
      });
    }

    const serverPort = process.env.PORT || 5000;
    let fileUrl = `http://localhost:${serverPort}/uploads/${req.file.filename}`;
    let publicId = '';

    // Attempt Cloudinary upload if configured
    if (isCloudinaryConfigured()) {
      try {
        const cloudRes = await cloudinary.uploader.upload(req.file.path, {
          folder: 'vidyaarambh_tuition',
          resource_type: 'auto',
        });
        fileUrl = cloudRes.secure_url;
        publicId = cloudRes.public_id;

        // Clean up local temp file after successful cloud upload
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
        console.log('☁️ [Cloudinary]: PDF uploaded successfully to cloud CDN.');
      } catch (cloudErr) {
        console.warn('⚠️ Cloudinary cloud upload warning:', cloudErr.message);
        console.warn('📁 Serving file seamlessly via local storage fallback.');
        // Fallback to local storage URL already set
      }
    }

    const newMaterial = new StudyMaterial({
      title: title.trim(),
      description: description ? description.trim() : '',
      category,
      fileUrl,
      publicId,
      fileName: req.file.originalname,
      targetClass: targetClass || 'All Classes',
      subject: subject || 'General',
      dueDate: dueDate ? new Date(dueDate) : null,
      totalMarks: totalMarks ? Number(totalMarks) : null,
      uploadedBy: req.user.id,
    });

    await newMaterial.save();

    return res.status(201).json({
      success: true,
      message: `${category} PDF uploaded successfully!`,
      material: newMaterial,
    });
  } catch (error) {
    console.error('uploadMaterial error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload study material PDF.',
    });
  }
};

// @desc    Get all study materials with filters
// @route   GET /api/materials
// @access  Private (Admin & Student)
exports.getMaterials = async (req, res) => {
  try {
    const { category, targetClass, search } = req.query;
    const query = {};

    if (category && category !== 'ALL') {
      query.category = category;
    }

    if (targetClass && targetClass !== 'ALL') {
      query.$or = [{ targetClass: targetClass }, { targetClass: 'All Classes' }];
    }

    if (search) {
      query.$and = [
        ...(query.$and || []),
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { subject: { $regex: search, $options: 'i' } },
          ],
        },
      ];
    }

    const materials = await StudyMaterial.find(query)
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: materials.length,
      materials,
    });
  } catch (error) {
    console.error('getMaterials error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve materials.',
    });
  }
};

// @desc    Delete study material PDF
// @route   DELETE /api/materials/:id
// @access  Private/Admin
exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const material = await StudyMaterial.findById(id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found.',
      });
    }

    // Try deleting from Cloudinary if publicId exists
    if (material.publicId) {
      try {
        await cloudinary.uploader.destroy(material.publicId, { resource_type: 'raw' });
      } catch (cErr) {
        console.warn('Cloudinary destroy warning:', cErr.message);
      }
    }

    await StudyMaterial.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'PDF Material deleted successfully.',
    });
  } catch (error) {
    console.error('deleteMaterial error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete material.',
    });
  }
};
