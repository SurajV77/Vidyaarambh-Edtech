const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    targetBatch: {
      type: String,
      default: 'ALL', // 'ALL' or specific batch name
    },
    priority: {
      type: String,
      enum: ['NORMAL', 'HIGH'],
      default: 'NORMAL',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notice', noticeSchema);
