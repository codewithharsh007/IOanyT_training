// Project lifecycle management.
const Project = require('../models/Project');
const Client = require('../models/Client');
const TimeLog = require('../models/TimeLog');
const Invoice = require('../models/Invoice');
const PaymentLedger = require('../models/PaymentLedger');
const { assertOwnership } = require('../middleware/ownershipCheck');

const createAppError = (message, statusCode) => {
  const error = new Error(message);
  error.name = 'AppError';
  error.statusCode = statusCode;
  return error;
};

const getAllProjects = async (freelancerId, { status, clientId, search, page = 1, limit = 20 }) => {
  const query = { freelancerId };
  if (status) query.status = status;
  if (clientId) query.clientId = clientId;
  if (search) query.name = { $regex: search, $options: 'i' };

  const skip = (page - 1) * limit;
  const [projects, total] = await Promise.all([
    Project.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Project.countDocuments(query),
  ]);

  return { projects, total, page };
};

const createProject = async (
  freelancerId,
  { name, clientId, status = 'Draft', description, startDate, deadline, budget, hourlyRate }
) => {
  const client = await Client.findById(clientId);
  // SECURITY [BOLA]: ownership validated
  assertOwnership(client, freelancerId);

  if (startDate && deadline && new Date(deadline) <= new Date(startDate)) {
    throw createAppError('Deadline must be after start date', 400);
  }

  const project = await Project.create({
    freelancerId,
    clientId,
    name: name.trim(),
    status,
    description: (description || '').trim(),
    startDate: startDate || null,
    deadline: deadline || null,
    budget: budget ?? null,
    hourlyRate: hourlyRate ?? null,
  });

  return project;
};

const getProjectById = async (projectId, freelancerId) => {
  const project = await Project.findById(projectId);
  // SECURITY [BOLA]: ownership validated
  assertOwnership(project, freelancerId);

  const timeLogs = await TimeLog.find({ projectId: project._id });
  const invoices = await Invoice.find({ projectId: project._id });

  const totalHours = timeLogs.reduce((sum, log) => sum + log.hours + log.minutes / 60, 0);

  const invoiceIds = invoices.map((invoice) => invoice._id);
  const payments = await PaymentLedger.find({ invoiceId: { $in: invoiceIds } });

  const totalInvoiced = invoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);
  const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);

  let progressPercent = 0;
  if (project.budget && project.hourlyRate) {
    const budget = Number(project.budget.toString());
    const rate = Number(project.hourlyRate.toString());
    progressPercent = budget > 0 ? Math.min(100, (totalHours * rate * 100) / budget) : 0;
  }

  return {
    project,
    stats: {
      totalHours,
      totalInvoiced,
      totalPaid,
      progressPercent: Math.round(progressPercent),
    },
  };
};

const updateProject = async (projectId, freelancerId, updates) => {
  const project = await Project.findById(projectId);
  // SECURITY [BOLA]: ownership validated
  assertOwnership(project, freelancerId);

  // RULE [US-007]: archived projects are read-only
  if (project.status === 'Archived') {
    // EDGE CASE [TC-018]: archived project update rejected
    throw createAppError('Archived projects are read-only and cannot be modified', 400);
  }

  if (updates.name !== undefined) project.name = updates.name.trim();
  if (updates.status !== undefined) project.status = updates.status;
  if (updates.description !== undefined) project.description = (updates.description || '').trim();
  if (updates.startDate !== undefined) project.startDate = updates.startDate || null;
  if (updates.deadline !== undefined) project.deadline = updates.deadline || null;
  if (updates.budget !== undefined) project.budget = updates.budget ?? null;
  if (updates.hourlyRate !== undefined) project.hourlyRate = updates.hourlyRate ?? null;

  if (project.startDate && project.deadline && new Date(project.deadline) <= new Date(project.startDate)) {
    throw createAppError('Deadline must be after start date', 400);
  }

  await project.save();
  return project;
};

const archiveProject = async (projectId, freelancerId) => {
  const project = await Project.findById(projectId);
  // SECURITY [BOLA]: ownership validated
  assertOwnership(project, freelancerId);

  if (project.status === 'Archived') {
    throw createAppError('Project already archived', 409);
  }

  project.status = 'Archived';
  await project.save();
  return { _id: project._id.toString(), status: project.status };
};

module.exports = {
  getAllProjects,
  createProject,
  getProjectById,
  updateProject,
  archiveProject,
};
