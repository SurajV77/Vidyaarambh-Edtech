const Notice = require('../models/Notice');

// @desc    Create announcement notice
// @route   POST /api/notices
// @access  Private/Admin
exports.createNotice = async (req, res) => {
  try {
    const { title, content, targetBatch, priority } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required for notice.',
      });
    }

    const notice = new Notice({
      title: title.trim(),
      content: content.trim(),
      targetBatch: targetBatch || 'ALL',
      priority: priority || 'NORMAL',
      author: req.user.id,
    });

    await notice.save();

    return res.status(201).json({
      success: true,
      message: 'Notice posted successfully.',
      notice,
    });
  } catch (error) {
    console.error('createNotice error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to post notice.',
    });
  }
};

// @desc    Get all notices
// @route   GET /api/notices
// @access  Private
exports.getNotices = async (req, res) => {
  try {
    const { batch } = req.query;
    const query = {};

    if (batch && batch !== 'ALL') {
      query.$or = [{ targetBatch: batch }, { targetBatch: 'ALL' }];
    }

    const notices = await Notice.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      notices,
    });
  } catch (error) {
    console.error('getNotices error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notices.',
    });
  }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    await Notice.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Notice removed successfully.',
    });
  } catch (error) {
    console.error('deleteNotice error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete notice.',
    });
  }
};
