const User = require('../models/User');
const Fee = require('../models/Fee');
const StudyMaterial = require('../models/StudyMaterial');
const Notice = require('../models/Notice');

// @desc    Get Student Portal Dashboard Summary
// @route   GET /api/student/dashboard
// @access  Private/Student
exports.getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await User.findById(studentId).select('-password');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student account not found.',
      });
    }

    // Fetch fee records for this student
    const fees = await Fee.find({ student: studentId }).sort({ year: -1, createdAt: -1 });

    let totalPaid = 0;
    let pendingDue = 0;
    fees.forEach((f) => {
      totalPaid += f.amountPaid || 0;
      const diff = (f.amountDue || 0) - (f.amountPaid || 0);
      if (diff > 0) pendingDue += diff;
    });

    // Fetch study materials for student's class
    const materials = await StudyMaterial.find({
      $or: [{ targetClass: student.standardClass }, { targetClass: 'All Classes' }],
    }).sort({ createdAt: -1 });

    const homeworkCount = materials.filter((m) => m.category === 'HOMEWORK').length;
    const notesCount = materials.filter((m) => m.category === 'NOTES').length;
    const testsCount = materials.filter((m) => m.category === 'TEST').length;

    // Fetch notices for student's batch
    const notices = await Notice.find({
      $or: [{ targetBatch: student.batch }, { targetBatch: 'ALL' }],
    })
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      data: {
        student,
        feeSummary: {
          totalPaid,
          pendingDue,
          recentFees: fees.slice(0, 5),
        },
        materialsSummary: {
          total: materials.length,
          homeworkCount,
          notesCount,
          testsCount,
          recentMaterials: materials.slice(0, 6),
        },
        notices,
      },
    });
  } catch (error) {
    console.error('getStudentDashboard error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve student dashboard data.',
    });
  }
};

// @desc    Get all fees for logged-in student
// @route   GET /api/student/fees
// @access  Private/Student
exports.getMyFees = async (req, res) => {
  try {
    const studentId = req.user.id;
    const fees = await Fee.find({ student: studentId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      fees,
    });
  } catch (error) {
    console.error('getMyFees error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve fee records.',
    });
  }
};

// @desc    Get all study materials for logged-in student
// @route   GET /api/student/materials
// @access  Private/Student
exports.getMyMaterials = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    const { category } = req.query;

    const query = {
      $or: [{ targetClass: student.standardClass }, { targetClass: 'All Classes' }],
    };

    if (category && category !== 'ALL') {
      query.category = category;
    }

    const materials = await StudyMaterial.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: materials.length,
      materials,
    });
  } catch (error) {
    console.error('getMyMaterials error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve study materials.',
    });
  }
};
