import express from 'express';
import { AuditLog, User } from '../models/index.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { Op } from 'sequelize';

const router = express.Router();

router.get('/', authenticate, authorize('read:audit'), async (req, res) => {
  try {
    const { page = 1, limit = 50, action, status, userId, startDate, endDate } = req.query;
    
    const where = {};
    if (action) where.action = { [Op.like]: `%${action}%` };
    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp[Op.gte] = new Date(startDate);
      if (endDate) where.timestamp[Op.lte] = new Date(endDate);
    }

    const offset = (page - 1) * limit;
    
    const { count, rows: logs } = await AuditLog.findAndCountAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }],
      order: [['timestamp', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      logs,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch audit logs' });
  }
});

router.get('/stats', authenticate, authorize('read:audit'), async (req, res) => {
  try {
    const totalLogs = await AuditLog.count();
    const successLogs = await AuditLog.count({ where: { status: 'success' } });
    const failedLogs = await AuditLog.count({ where: { status: 'failed' } });
    const deniedLogs = await AuditLog.count({ where: { status: 'denied' } });

    res.json({
      success: true,
      stats: { totalLogs, successLogs, failedLogs, deniedLogs }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
});

export default router;