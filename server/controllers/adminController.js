const User = require('../models/User');
const Fee = require('../models/Fee');
const StudyMaterial = require('../models/StudyMaterial');
const Notice = require('../models/Notice');
const Standard = require('../models/Standard');
const { ensureMonthlyFeesForActiveStudents } = require('../services/feeRenewalService');

// @desc    Get Admin Dashboard Stats & Revenue Chart Data
// @route   GET /api/admin/dashboard-stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    // Ensure monthly fees exist for all active students for the current month
    await ensureMonthlyFeesForActiveStudents();

    const totalStudents = await User.countDocuments({ role: 'student' });
    const activeStudents = await User.countDocuments({ role: 'student', isActive: true });
    const totalMaterials = await StudyMaterial.countDocuments();
    const totalNotices = await Notice.countDocuments();

    // Aggregate Fee Metrics
    const allFees = await Fee.find().populate('student', 'name rollNo standardClass');

    let totalRevenue = 0;
    let totalPendingDues = 0;
    let currentMonthRevenue = 0;

    const currentMonthName = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    allFees.forEach((fee) => {
      totalRevenue += fee.amountPaid || 0;
      const due = (fee.amountDue || 0) - (fee.amountPaid || 0);
      if (due > 0) {
        totalPendingDues += due;
      }
      if (fee.month === currentMonthName && fee.year === currentYear) {
        currentMonthRevenue += fee.amountPaid || 0;
      }
    });

    // Generate monthly revenue trend for Recharts (past 6 months)
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currentMonthIdx = new Date().getMonth();
    const chartData = [];

    for (let i = 5; i >= 0; i--) {
      let idx = currentMonthIdx - i;
      let yr = currentYear;
      if (idx < 0) {
        idx += 12;
        yr -= 1;
      }
      const mName = monthNames[idx];

      let monthCollected = 0;
      let monthPending = 0;

      allFees.forEach((f) => {
        if (f.month === mName && f.year === yr) {
          monthCollected += f.amountPaid || 0;
          const remaining = (f.amountDue || 0) - (f.amountPaid || 0);
          if (remaining > 0) monthPending += remaining;
        }
      });

      chartData.push({
        month: mName.substring(0, 3),
        fullMonth: `${mName} ${yr}`,
        collected: monthCollected,
        pending: monthPending,
      });
    }

    // Recent 5 payments
    const recentPayments = await Fee.find({ amountPaid: { $gt: 0 } })
      .sort({ updatedAt: -1 })
      .limit(5)
      .populate('student', 'name rollNo standardClass');

    return res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        activeStudents,
        totalRevenue,
        currentMonthRevenue,
        totalPendingDues,
        totalMaterials,
        totalNotices,
        chartData,
        recentPayments,
      },
    });
  } catch (error) {
    console.error('getDashboardStats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard statistics.',
    });
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private/Admin
exports.getStudents = async (req, res) => {
  try {
    const { search, standardClass, batch } = req.query;
    const query = { role: 'student' };

    if (standardClass && standardClass !== 'ALL') {
      query.standardClass = standardClass;
    }

    if (batch && batch !== 'ALL') {
      query.batch = batch;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await User.find(query).select('-password').sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error('getStudents error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve students.',
    });
  }
};

// @desc    Create new student account
// @route   POST /api/admin/students
// @access  Private/Admin
exports.createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      rollNo,
      standardClass,
      batch,
      phone,
      parentPhone,
      monthlyFeeAmount,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required for student creation.',
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    const newStudent = new User({
      name: name.trim(),
      email: cleanEmail,
      password, // Pre-save hook hashes this
      role: 'student',
      rollNo: rollNo ? rollNo.trim() : `VR-${Math.floor(1000 + Math.random() * 9000)}`,
      standardClass: standardClass || 'Class 10',
      batch: batch || 'Morning Batch',
      phone: phone ? phone.trim() : '',
      parentPhone: parentPhone ? parentPhone.trim() : '',
      monthlyFeeAmount: monthlyFeeAmount ? Number(monthlyFeeAmount) : 2000,
      isActive: true,
    });

    await newStudent.save();

    // Auto-create initial fee record for the current month
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    const currentYear = new Date().getFullYear();

    const initialFee = new Fee({
      student: newStudent._id,
      month: currentMonth,
      year: currentYear,
      amountDue: newStudent.monthlyFeeAmount,
      amountPaid: 0,
      status: 'PENDING',
    });
    await initialFee.save();

    const studentSafe = await User.findById(newStudent._id).select('-password');

    return res.status(201).json({
      success: true,
      message: 'Student account created successfully.',
      student: studentSafe,
    });
  } catch (error) {
    console.error('createStudent error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create student account.',
    });
  }
};

// @desc    Update student account
// @route   PUT /api/admin/students/:id
// @access  Private/Admin
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      rollNo,
      standardClass,
      batch,
      phone,
      parentPhone,
      monthlyFeeAmount,
      isActive,
      password,
    } = req.body;

    const student = await User.findById(id);
    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    if (name) student.name = name.trim();
    if (rollNo !== undefined) student.rollNo = rollNo.trim();
    if (standardClass) student.standardClass = standardClass;
    if (batch) student.batch = batch;
    if (phone !== undefined) student.phone = phone.trim();
    if (parentPhone !== undefined) student.parentPhone = parentPhone.trim();
    if (monthlyFeeAmount !== undefined) student.monthlyFeeAmount = Number(monthlyFeeAmount);
    if (isActive !== undefined) student.isActive = isActive;
    if (password && password.trim().length > 0) {
      student.password = password.trim();
    }

    await student.save();
    const updated = await User.findById(id).select('-password');

    return res.status(200).json({
      success: true,
      message: 'Student updated successfully.',
      student: updated,
    });
  } catch (error) {
    console.error('updateStudent error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update student.',
    });
  }
};

// @desc    Delete student account
// @route   DELETE /api/admin/students/:id
// @access  Private/Admin
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await User.findById(id);

    if (!student || student.role !== 'student') {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    await User.findByIdAndDelete(id);
    await Fee.deleteMany({ student: id });

    return res.status(200).json({
      success: true,
      message: 'Student and related records deleted successfully.',
    });
  } catch (error) {
    console.error('deleteStudent error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete student.',
    });
  }
};

// @desc    Get fee records
// @route   GET /api/admin/fees
// @access  Private/Admin
exports.getFeeRecords = async (req, res) => {
  try {
    const { month, year, status, studentId } = req.query;

    // Automatically ensure active students have a fee record for the queried month/year
    const targetMonth = month && month !== 'ALL' ? month : new Date().toLocaleString('default', { month: 'long' });
    const targetYear = year ? Number(year) : new Date().getFullYear();
    await ensureMonthlyFeesForActiveStudents(targetMonth, targetYear);

    const query = {};

    if (month && month !== 'ALL') query.month = month;
    if (year) query.year = Number(year);
    if (status && status !== 'ALL') query.status = status;
    if (studentId) query.student = studentId;

    const fees = await Fee.find(query)
      .populate('student', 'name email rollNo standardClass batch phone')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      fees,
    });
  } catch (error) {
    console.error('getFeeRecords error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve fee records.',
    });
  }
};

// @desc    Record or Update Fee Payment
// @route   POST /api/admin/fees/pay
// @access  Private/Admin
exports.recordFeePayment = async (req, res) => {
  try {
    const {
      feeId,
      studentId,
      month,
      year,
      amountPaid,
      amountDue,
      paymentMode,
      notes,
    } = req.body;

    let feeDoc;

    if (feeId) {
      feeDoc = await Fee.findById(feeId);
    } else if (studentId && month && year) {
      feeDoc = await Fee.findOne({ student: studentId, month, year: Number(year) });
    }

    const paidNum = Number(amountPaid) || 0;
    const dueNum = Number(amountDue) || 0;

    const generateReceiptNo = () => {
      return `VR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    };

    if (feeDoc) {
      feeDoc.amountPaid = paidNum;
      if (dueNum > 0) feeDoc.amountDue = dueNum;
      feeDoc.paymentMode = paymentMode || feeDoc.paymentMode || 'UPI';
      feeDoc.paymentDate = paidNum > 0 ? new Date() : null;
      feeDoc.notes = notes || feeDoc.notes;

      if (feeDoc.amountPaid >= feeDoc.amountDue) {
        feeDoc.status = 'PAID';
      } else if (feeDoc.amountPaid > 0) {
        feeDoc.status = 'PARTIAL';
      } else {
        feeDoc.status = 'PENDING';
      }

      if (!feeDoc.receiptNumber && feeDoc.amountPaid > 0) {
        feeDoc.receiptNumber = generateReceiptNo();
      }

      await feeDoc.save();
    } else {
      let status = 'PENDING';
      if (paidNum >= dueNum && dueNum > 0) {
        status = 'PAID';
      } else if (paidNum > 0) {
        status = 'PARTIAL';
      }

      feeDoc = new Fee({
        student: studentId,
        month,
        year: Number(year) || new Date().getFullYear(),
        amountDue: dueNum,
        amountPaid: paidNum,
        status,
        paymentMode: paymentMode || 'UPI',
        paymentDate: paidNum > 0 ? new Date() : null,
        receiptNumber: paidNum > 0 ? generateReceiptNo() : '',
        notes: notes || '',
      });
      await feeDoc.save();
    }

    const populated = await Fee.findById(feeDoc._id).populate(
      'student',
      'name email rollNo standardClass batch'
    );

    return res.status(200).json({
      success: true,
      message: 'Fee payment recorded successfully.',
      fee: populated,
    });
  } catch (error) {
    console.error('recordFeePayment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record fee payment.',
    });
  }
};

// @desc    Manually Trigger or Sync Monthly Tuition Dues for a given month & year
// @route   POST /api/admin/fees/generate-monthly
// @access  Private/Admin
exports.generateMonthlyFees = async (req, res) => {
  try {
    const { month, year } = req.body;
    const targetMonth = month || new Date().toLocaleString('default', { month: 'long' });
    const targetYear = Number(year) || new Date().getFullYear();

    const result = await ensureMonthlyFeesForActiveStudents(targetMonth, targetYear);

    return res.status(200).json({
      success: true,
      message: `Tuition fee renewal processed for ${targetMonth} ${targetYear}.`,
      result,
    });
  } catch (error) {
    console.error('generateMonthlyFees error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process monthly fee renewal.',
    });
  }
};

// @desc    Get all academic standards / classes
// @route   GET /api/admin/standards
// @access  Private/Admin
exports.getStandards = async (req, res) => {
  try {
    const standards = await Standard.find().sort({ order: 1, createdAt: 1 });
    return res.status(200).json({
      success: true,
      count: standards.length,
      standards,
    });
  } catch (error) {
    console.error('getStandards error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve standards.',
    });
  }
};

// @desc    Create a new academic standard manually
// @route   POST /api/admin/standards
// @access  Private/Admin
exports.createStandard = async (req, res) => {
  try {
    const { name, description, defaultMonthlyFee, order } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Standard name is required (e.g. "Class 6", "Class 7").',
      });
    }

    const cleanName = name.trim();
    const existing = await Standard.findOne({
      name: { $regex: new RegExp(`^${cleanName}$`, 'i') },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Standard "${cleanName}" already exists.`,
      });
    }

    let standardOrder = order !== undefined && order !== null && order !== '' ? Number(order) : 0;
    if (!standardOrder) {
      const match = cleanName.match(/\d+/);
      standardOrder = match ? parseInt(match[0], 10) : 50;
    }

    const newStandard = new Standard({
      name: cleanName,
      order: standardOrder,
      description: description ? description.trim() : '',
      defaultMonthlyFee: defaultMonthlyFee ? Number(defaultMonthlyFee) : 2000,
      isActive: true,
    });

    await newStandard.save();

    return res.status(201).json({
      success: true,
      message: `Standard "${cleanName}" created successfully.`,
      standard: newStandard,
    });
  } catch (error) {
    console.error('createStandard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create standard.',
    });
  }
};

// @desc    Update an academic standard
// @route   PUT /api/admin/standards/:id
// @access  Private/Admin
exports.updateStandard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, defaultMonthlyFee, order, isActive } = req.body;

    const standard = await Standard.findById(id);
    if (!standard) {
      return res.status(404).json({
        success: false,
        message: 'Standard not found.',
      });
    }

    if (name && name.trim()) standard.name = name.trim();
    if (description !== undefined) standard.description = description.trim();
    if (defaultMonthlyFee !== undefined) standard.defaultMonthlyFee = Number(defaultMonthlyFee);
    if (order !== undefined) standard.order = Number(order);
    if (isActive !== undefined) standard.isActive = Boolean(isActive);

    await standard.save();

    return res.status(200).json({
      success: true,
      message: 'Standard updated successfully.',
      standard,
    });
  } catch (error) {
    console.error('updateStandard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update standard.',
    });
  }
};

// @desc    Delete an academic standard
// @route   DELETE /api/admin/standards/:id
// @access  Private/Admin
exports.deleteStandard = async (req, res) => {
  try {
    const { id } = req.params;
    const standard = await Standard.findById(id);
    if (!standard) {
      return res.status(404).json({
        success: false,
        message: 'Standard not found.',
      });
    }

    // Check if any student currently belongs to this standard
    const enrolledCount = await User.countDocuments({
      role: 'student',
      standardClass: standard.name,
    });

    if (enrolledCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete "${standard.name}" because ${enrolledCount} active student(s) are currently enrolled in it. Reassign those students or deactivate the standard instead.`,
      });
    }

    await Standard.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: `Standard "${standard.name}" removed successfully.`,
    });
  } catch (error) {
    console.error('deleteStandard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete standard.',
    });
  }
};

