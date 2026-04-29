// Read-only audit log service.
const AuditLog = require('../models/AuditLog');

const getAuditLogs = async (freelancerId, { entityType, entityId, page = 1, limit = 20 }) => {
  // SECURITY [BOLA]: audit logs scoped by freelancerId
  const query = { freelancerId };
  if (entityType) query.entityType = entityType;
  if (entityId) query.entityId = entityId;

  const skip = (page - 1) * limit;
  const [logs, total] = await Promise.all([
    AuditLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    AuditLog.countDocuments(query),
  ]);

  return { logs, total };
};

module.exports = { getAuditLogs };
