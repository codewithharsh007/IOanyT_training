// Time log CRUD with lock enforcement.
const TimeLog = require('../models/TimeLog');
const Project = require('../models/Project');
const { assertOwnership } = require('../middleware/ownershipCheck');

const createAppError = (message, statusCode) => {
  const error = new Error(message);
  error.name = 'AppError';
  error.statusCode = statusCode;
  return error;
};

const getAllTimeLogs = async (
  freelancerId,
  { projectId, search, startDate, endDate, page = 1, limit = 20 }
) => {
  const query = { freelancerId };
  if (projectId) query.projectId = projectId;
  if (search) query.description = { $regex: search, $options: 'i' };
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;
  const [timeLogs, total] = await Promise.all([
    TimeLog.find(query).sort({ date: -1 }).skip(skip).limit(limit),
    TimeLog.countDocuments(query),
  ]);

  const totalHours = timeLogs.reduce((sum, log) => sum + log.hours + log.minutes / 60, 0);
  const billableHours = timeLogs
    .filter((log) => log.status === 'Active')
    .reduce((sum, log) => sum + log.hours + log.minutes / 60, 0);

  return { timeLogs, total, totalHours, billableHours };
};

const createTimeLog = async (freelancerId, { projectId, date, hours, minutes, description }) => {
  const project = await Project.findById(projectId);
  // SECURITY [BOLA]: ownership validated
  assertOwnership(project, freelancerId);

  if (new Date(date) > new Date()) {
    throw createAppError('Date cannot be in the future', 400);
  }

  if (Number(hours) + Number(minutes) <= 0) {
    throw createAppError('Duration must be greater than 0', 400);
  }

  const timeLog = await TimeLog.create({
    freelancerId,
    projectId,
    date,
    hours,
    minutes,
    description: (description || '').trim(),
    status: 'Active',
  });

  return timeLog;
};

const updateTimeLog = async (timeLogId, freelancerId, updates) => {
  const timeLog = await TimeLog.findById(timeLogId);
  // SECURITY [BOLA]: ownership validated
  assertOwnership(timeLog, freelancerId);

  // RULE [US-008]: locked time logs cannot be modified
  if (timeLog.status === 'Locked') {
    // EDGE CASE [TC-020]: reject edits to locked time logs
    throw createAppError('Locked time logs cannot be modified', 400);
  }

  if (updates.projectId !== undefined) timeLog.projectId = updates.projectId;
  if (updates.date !== undefined) timeLog.date = updates.date;
  if (updates.hours !== undefined) timeLog.hours = updates.hours;
  if (updates.minutes !== undefined) timeLog.minutes = updates.minutes;
  if (updates.description !== undefined) timeLog.description = (updates.description || '').trim();

  if (timeLog.date && new Date(timeLog.date) > new Date()) {
    throw createAppError('Date cannot be in the future', 400);
  }

  if (Number(timeLog.hours) + Number(timeLog.minutes) <= 0) {
    throw createAppError('Duration must be greater than 0', 400);
  }

  await timeLog.save();
  return timeLog;
};

const deleteTimeLog = async (timeLogId, freelancerId) => {
  const timeLog = await TimeLog.findById(timeLogId);
  // SECURITY [BOLA]: ownership validated
  assertOwnership(timeLog, freelancerId);

  // RULE [US-008]: locked time logs cannot be deleted
  if (timeLog.status === 'Locked') {
    // EDGE CASE [TC-021]: reject deletes for locked time logs
    throw createAppError('Locked time logs cannot be deleted', 400);
  }

  await timeLog.deleteOne();
};

const lockTimeLogs = async (timeLogIds, invoiceId) => {
  if (!timeLogIds || timeLogIds.length === 0) return;

  // RULE [BR-03]: time logs lock on invoice send
  await TimeLog.updateMany(
    { _id: { $in: timeLogIds }, status: 'Active' },
    { status: 'Locked', invoiceId }
  );
};

module.exports = {
  getAllTimeLogs,
  createTimeLog,
  updateTimeLog,
  deleteTimeLog,
  lockTimeLogs,
};
