const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: ['HOMEWORK', 'NOTES', 'TEST'],
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      default: '',
    },
    fileName: {
      type: String,
      default: 'document.pdf',
    },
    targetClass: {
      type: String,
      default: 'All Classes', // e.g. "Class 10", "Class 12", "All Classes"
    },
    subject: {
      type: String,
      default: 'General',
    },
    dueDate: {
      type: Date,
      default: null,
    },
    totalMarks: {
      type: Number,
      default: null,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
