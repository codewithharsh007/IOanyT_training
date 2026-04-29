// Time log routes.
const express = require('express');
const { protect } = require('../middleware/auth');
const { validateCreateTimeLog, validateUpdateTimeLog } = require('../middleware/validate');
const timeLogService = require('../services/timeLogService');
const { successResponse } = require('../utils/response');

const router = express.Router();
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const data = await timeLogService.getAllTimeLogs(req.user.userId, req.query);
    return successResponse(res, 200, 'Time logs fetched', data);
  })
);

router.post(
  '/',
  protect,
  validateCreateTimeLog,
  asyncHandler(async (req, res) => {
    const data = await timeLogService.createTimeLog(req.user.userId, req.body);
    return successResponse(res, 201, 'Time logged', data);
  })
);

router.put(
  '/:id',
  protect,
  validateUpdateTimeLog,
  asyncHandler(async (req, res) => {
    const data = await timeLogService.updateTimeLog(req.params.id, req.user.userId, req.body);
    return successResponse(res, 200, 'Time log updated', data);
  })
);

router.delete(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    await timeLogService.deleteTimeLog(req.params.id, req.user.userId);
    return successResponse(res, 200, 'Time log deleted', {});
  })
);

module.exports = router;
