const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token missing. Please log in.',
      });
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.JWT_SECRET || 'vidyaarambh_tuition_super_secret_jwt_key_2026';

    const decoded = jwt.verify(token, jwtSecret);

    // Attach basic decoded info
    req.user = decoded;

    // Optionally check if user is still active in DB
    const userDoc = await User.findById(decoded.id).select('-password');
    if (!userDoc) {
      return res.status(401).json({
        success: false,
        message: 'User belonging to this token no longer exists.',
      });
    }

    if (!userDoc.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact your teacher.',
      });
    }

    req.userDoc = userDoc;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token.',
    });
  }
};

// Admin/Teacher role guard
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied: Admin/Teacher privilege required.',
  });
};

// Student role guard
const isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied: Student access only.',
  });
};

module.exports = { verifyToken, isAdmin, isStudent };
