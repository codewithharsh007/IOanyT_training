// Client portal routes.
const express = require('express');
const { protect, clientOnly } = require('../middleware/auth');
const portalService = require('../services/portalService');
const { successResponse } = require('../utils/response');

const router = express.Router();
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  '/invoices',
  protect,
  clientOnly,
  asyncHandler(async (req, res) => {
    const data = await portalService.getClientInvoices(req.user.clientId, req.user.freelancerId);
    return successResponse(res, 200, 'Invoices fetched', data);
  })
);

router.get(
  '/invoices/:id',
  protect,
  clientOnly,
  asyncHandler(async (req, res) => {
    const data = await portalService.getClientInvoiceById(
      req.params.id,
      req.user.clientId,
      req.user.freelancerId
    );
    return successResponse(res, 200, 'Invoice fetched', data);
  })
);

router.get(
  '/projects',
  protect,
  clientOnly,
  asyncHandler(async (req, res) => {
    const data = await portalService.getClientProjects(req.user.clientId, req.user.freelancerId);
    return successResponse(res, 200, 'Projects fetched', data);
  })
);

module.exports = router;
