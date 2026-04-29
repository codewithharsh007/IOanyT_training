// Client CRUD and invitation logic.
const Client = require('../models/Client');
const InviteToken = require('../models/InviteToken');
const AuditLog = require('../models/AuditLog');
const { generateRandomToken, hashToken } = require('../utils/tokenUtils');
const { sendInviteEmail } = require('./emailService');
const { assertOwnership } = require('../middleware/ownershipCheck');
const { INVITE_TOKEN_EXPIRES_HOURS, CLIENT_URL } = require('../config/constants');

const createAppError = (message, statusCode) => {
  const error = new Error(message);
  error.name = 'AppError';
  error.statusCode = statusCode;
  return error;
};

const getAllClients = async (freelancerId, { search, status, page = 1, limit = 20 }) => {
  const query = { freelancerId };
  if (status) query.status = status;
  if (search) query.name = { $regex: search, $options: 'i' };

  const skip = (page - 1) * limit;
  const [clients, total] = await Promise.all([
    Client.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Client.countDocuments(query),
  ]);

  return { clients, total, page };
};

const createClient = async (freelancerId, { name, company, email, phone, notes }) => {
  try {
    // RULE [US-004]: client bound to freelancerId
    const client = await Client.create({
      freelancerId,
      name: name.trim(),
      company: (company || '').trim(),
      email: email.toLowerCase().trim(),
      phone: (phone || '').trim(),
      notes: (notes || '').trim(),
    });
    return client;
  } catch (error) {
    if (error.code === 11000) {
      // EDGE CASE [TC-010]: reject duplicate email for same freelancer
      throw createAppError('Email already exists for this freelancer', 409);
    }
    throw error;
  }
};

const getClientById = async (clientId, freelancerId) => {
  const client = await Client.findById(clientId);
  // SECURITY [BOLA]: ownership validated
  assertOwnership(client, freelancerId);
  return client;
};

const updateClient = async (clientId, freelancerId, updates) => {
  const client = await Client.findById(clientId);
  // SECURITY [BOLA]: ownership validated
  assertOwnership(client, freelancerId);

  if (updates.name !== undefined) client.name = updates.name.trim();
  if (updates.company !== undefined) client.company = (updates.company || '').trim();
  if (updates.email !== undefined) client.email = updates.email.toLowerCase().trim();
  if (updates.phone !== undefined) client.phone = (updates.phone || '').trim();
  if (updates.notes !== undefined) client.notes = (updates.notes || '').trim();

  try {
    await client.save();
  } catch (error) {
    if (error.code === 11000) {
      // EDGE CASE [TC-010]: reject duplicate email for same freelancer
      throw createAppError('Email already exists for this freelancer', 409);
    }
    throw error;
  }

  return client;
};

const archiveClient = async (clientId, freelancerId) => {
  const client = await Client.findById(clientId);
  // SECURITY [BOLA]: ownership validated
  assertOwnership(client, freelancerId);

  if (client.status === 'Archived') {
    throw createAppError('Client already archived', 409);
  }

  client.status = 'Archived';
  await client.save();
  return { _id: client._id.toString(), status: client.status };
};

const unarchiveClient = async (clientId, freelancerId) => {
  const client = await Client.findById(clientId);
  // SECURITY [BOLA]: ownership validated
  assertOwnership(client, freelancerId);

  if (client.status === 'Active') {
    throw createAppError('Client already active', 409);
  }

  client.status = 'Active';
  await client.save();
  return { _id: client._id.toString(), status: client.status };
};

const inviteClient = async (clientId, freelancerId) => {
  const client = await Client.findById(clientId);
  // SECURITY [BOLA]: ownership validated
  assertOwnership(client, freelancerId);

  if (client.status === 'Archived') {
    throw createAppError('Cannot invite an archived client', 400);
  }

  const existingInvite = await InviteToken.findOne({
    clientId,
    status: 'Active',
    expiresAt: { $gt: new Date() },
  });

  if (existingInvite) {
    throw createAppError('Active invite already pending', 409);
  }

  const rawToken = generateRandomToken();
  const tokenHash = hashToken(rawToken);
  // RULE [US-005]: invite token valid for 48 hours
  const expiresAt = new Date(Date.now() + INVITE_TOKEN_EXPIRES_HOURS * 60 * 60 * 1000);

  await InviteToken.create({
    clientId,
    freelancerId,
    tokenHash,
    expiresAt,
    status: 'Active',
  });

  // RULE [BR-05]: audit log required for client invitation
  await AuditLog.create({
    freelancerId,
    entityType: 'Client',
    entityId: clientId.toString(),
    action: 'CLIENT_INVITED',
    performedBy: freelancerId,
  });

  await sendInviteEmail(client.email, 'Freelancer', `${CLIENT_URL}/invite?token=${rawToken}`);

  return { inviteToken: rawToken, expiresAt };
};

module.exports = {
  getAllClients,
  createClient,
  getClientById,
  updateClient,
  archiveClient,
  unarchiveClient,
  inviteClient,
};
