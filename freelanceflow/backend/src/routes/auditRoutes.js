// Audit log routes.
const express = require('express');
const { protect } = require('../middleware/auth');
const auditService = require('../services/auditService');
const { successResponse } = require('../utils/response');

const router = express.Router();
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const data = await auditService.getAuditLogs(req.user.userId, req.query);
    return successResponse(res, 200, 'Audit logs fetched', data);
  })
);

module.exports = router;
