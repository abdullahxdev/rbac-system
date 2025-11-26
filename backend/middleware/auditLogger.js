import { AuditLog } from '../models/index.js';

export const logAudit = (action, resource = null) => {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      res.send = originalSend;
      
      const status = res.statusCode >= 200 && res.statusCode < 300 ? 'success' : 'failed';
      
      AuditLog.create({
        userId: req.user ? req.user.id : null,
        action: action,
        resource: resource || req.baseUrl,
        status: status,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        details: JSON.stringify({
          method: req.method,
          path: req.path,
          query: req.query,
          statusCode: res.statusCode
        }),
        timestamp: new Date()
      }).catch(err => {
        console.error('Audit log error:', err);
      });

      return res.send(data);
    };
    
    next();
  };
};

export const logAccess = async (userId, action, resource, status, details = {}) => {
  try {
    await AuditLog.create({
      userId,
      action,
      resource,
      status,
      details: JSON.stringify(details),
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Audit logging failed:', error);
  }
};