const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    month: {
      type: String,
      required: true, // e.g., 'January', 'February'
    },
    year: {
      type: Number,
      required: true, // e.g., 2026
    },
    amountDue: {
      type: Number,
      required: true,
      default: 0,
    },
    amountPaid: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['PAID', 'PARTIAL', 'PENDING'],
      default: 'PENDING',
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    paymentMode: {
      type: String,
      enum: ['UPI', 'Cash', 'Bank Transfer', 'Cheque', 'None'],
      default: 'None',
    },
    receiptNumber: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Fee', feeSchema);
