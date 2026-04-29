// Client routes.
const express = require('express');
const { protect } = require('../middleware/auth');
const { validateCreateClient, validateUpdateClient } = require('../middleware/validate');
const clientService = require('../services/clientService');
const { successResponse } = require('../utils/response');

const router = express.Router();
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const data = await clientService.getAllClients(req.user.userId, req.query);
    return successResponse(res, 200, 'Clients fetched', data);
  })
);

router.post(
  '/',
  protect,
  validateCreateClient,
  asyncHandler(async (req, res) => {
    const data = await clientService.createClient(req.user.userId, req.body);
    return successResponse(res, 201, 'Client created', data);
  })
);

router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const data = await clientService.getClientById(req.params.id, req.user.userId);
    return successResponse(res, 200, 'Client fetched', data);
  })
);

router.put(
  '/:id',
  protect,
  validateUpdateClient,
  asyncHandler(async (req, res) => {
    const data = await clientService.updateClient(req.params.id, req.user.userId, req.body);
    return successResponse(res, 200, 'Client updated', data);
  })
);

router.patch(
  '/:id/archive',
  protect,
  asyncHandler(async (req, res) => {
    const data = await clientService.archiveClient(req.params.id, req.user.userId);
    return successResponse(res, 200, 'Client archived', data);
  })
);

router.patch(
  '/:id/unarchive',
  protect,
  asyncHandler(async (req, res) => {
    const data = await clientService.unarchiveClient(req.params.id, req.user.userId);
    return successResponse(res, 200, 'Client unarchived', data);
  })
);

router.post(
  '/:id/invite',
  protect,
  asyncHandler(async (req, res) => {
    const data = await clientService.inviteClient(req.params.id, req.user.userId);
    return successResponse(res, 200, 'Invitation sent', data);
  })
);

module.exports = router;
