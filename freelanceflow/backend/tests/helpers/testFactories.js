// Test data factory helpers.
const bcrypt = require('bcryptjs');
const User = require('../../src/models/User');
const Client = require('../../src/models/Client');
const Project = require('../../src/models/Project');
const Invoice = require('../../src/models/Invoice');
const TimeLog = require('../../src/models/TimeLog');
const InvoiceLineItem = require('../../src/models/InvoiceLineItem');

const createTestUser = async (overrides = {}) => {
  const passwordHash = await bcrypt.hash('TestPass123!', 12);
  return User.create({
    name: 'Test User',
    email: `user_${Date.now()}@test.com`,
    passwordHash,
    isEmailVerified: true,
    ...overrides,
  });
};

const createTestClient = async (freelancerId, overrides = {}) =>
  Client.create({
    freelancerId,
    name: 'Acme Client',
    email: `client_${Date.now()}@test.com`,
    status: 'Active',
    ...overrides,
  });

const createTestProject = async (freelancerId, clientId, overrides = {}) =>
  Project.create({
    freelancerId,
    clientId,
    name: 'Project Alpha',
    status: 'Draft',
    ...overrides,
  });

const createTestInvoice = async (freelancerId, clientId, overrides = {}) => {
  const invoice = await Invoice.create({
    freelancerId,
    clientId,
    invoiceNumber: `INV-${String(Date.now()).slice(-4)}`,
    status: 'Draft',
    issueDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    taxPercent: 0,
    subtotal: 100,
    totalAmount: 100,
    ...overrides,
  });

  await InvoiceLineItem.create({
    invoiceId: invoice._id,
    description: 'Test line item',
    quantity: 1,
    rate: 100,
    total: 100,
  });

  return invoice;
};

const createTestTimeLog = async (freelancerId, projectId, overrides = {}) =>
  TimeLog.create({
    freelancerId,
    projectId,
    date: new Date(),
    hours: 1,
    minutes: 0,
    status: 'Active',
    ...overrides,
  });

module.exports = {
  createTestUser,
  createTestClient,
  createTestProject,
  createTestInvoice,
  createTestTimeLog,
};
