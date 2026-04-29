// Project routes.
const express = require('express');
const { protect } = require('../middleware/auth');
const { validateCreateProject, validateUpdateProject } = require('../middleware/validate');
const projectService = require('../services/projectService');
const { successResponse } = require('../utils/response');

const router = express.Router();
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const data = await projectService.getAllProjects(req.user.userId, req.query);
    return successResponse(res, 200, 'Projects fetched', data);
  })
);

router.post(
  '/',
  protect,
  validateCreateProject,
  asyncHandler(async (req, res) => {
    const data = await projectService.createProject(req.user.userId, req.body);
    return successResponse(res, 201, 'Project created', data);
  })
);

router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const data = await projectService.getProjectById(req.params.id, req.user.userId);
    return successResponse(res, 200, 'Project fetched', data);
  })
);

router.put(
  '/:id',
  protect,
  validateUpdateProject,
  asyncHandler(async (req, res) => {
    const data = await projectService.updateProject(req.params.id, req.user.userId, req.body);
    return successResponse(res, 200, 'Project updated', data);
  })
);

router.patch(
  '/:id/archive',
  protect,
  asyncHandler(async (req, res) => {
    const data = await projectService.archiveProject(req.params.id, req.user.userId);
    return successResponse(res, 200, 'Project archived', data);
  })
);

module.exports = router;
