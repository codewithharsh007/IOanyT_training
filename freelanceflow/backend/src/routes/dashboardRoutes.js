// Dashboard routes.
const express = require('express');
const { protect } = require('../middleware/auth');
const dashboardService = require('../services/dashboardService');
const { successResponse } = require('../utils/response');

const router = express.Router();
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const data = await dashboardService.getMetrics(req.user.userId);
    return successResponse(res, 200, 'Dashboard data fetched', data);
  })
);

module.exports = router;
