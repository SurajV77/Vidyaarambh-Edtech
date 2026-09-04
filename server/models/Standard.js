const mongoose = require('mongoose');

const standardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true, // e.g. "Class 6", "Class 7", "Class 10"
    },
    order: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      default: '', // e.g. "Primary School", "Secondary School", "Board Prep"
    },
    defaultMonthlyFee: {
      type: Number,
      default: 2000,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Helper to auto-calculate order from standard name (e.g. "Class 7" -> 7)
standardSchema.pre('save', function (next) {
  if (this.isModified('name') || this.order === 0) {
    const match = this.name.match(/\d+/);
    if (match) {
      this.order = parseInt(match[0], 10);
    }
  }
  next();
});

module.exports = mongoose.model('Standard', standardSchema);
