// Settings routes.
const express = require('express');
const { protect } = require('../middleware/auth');
const { validateUpdateSettings } = require('../middleware/validate');
const settingsService = require('../services/settingsService');
const { successResponse } = require('../utils/response');

const router = express.Router();
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const data = await settingsService.getSettings(req.user.userId);
    return successResponse(res, 200, 'Settings fetched', data);
  })
);

router.put(
  '/',
  protect,
  validateUpdateSettings,
  asyncHandler(async (req, res) => {
    const data = await settingsService.updateSettings(req.user.userId, req.body);
    return successResponse(res, 200, 'Settings updated', data);
  })
);

module.exports = router;
