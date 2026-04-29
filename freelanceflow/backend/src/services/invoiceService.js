// Invoice creation and lifecycle management.
const Invoice = require('../models/Invoice');
const InvoiceLineItem = require('../models/InvoiceLineItem');
const TimeLog = require('../models/TimeLog');
const Client = require('../models/Client');
const Project = require('../models/Project');
const AuditLog = require('../models/AuditLog');
const PaymentLedger = require('../models/PaymentLedger');
const { lockTimeLogs } = require('./timeLogService');
const { sendInvoiceEmail } = require('./emailService');
const { generateInvoicePDF } = require('./pdfService');
const {
  calculateLineItemTotal,
  calculateSubtotal,
  calculateTotalAmount,
  calculateBalanceDue,
} = require('../utils/invoiceCalculator');
const { assertOwnership } = require('../middleware/ownershipCheck');
const { CLIENT_URL } = require('../config/constants');

const createAppError = (message, statusCode) => {
  const error = new Error(message);
  error.name = 'AppError';
  error.statusCode = statusCode;
  return error;
};

const getAllInvoices = async (freelancerId, { status, clientId, search, page = 1, limit = 20 }) => {
  const query = { freelancerId };
  if (status) query.status = status;
  if (clientId) query.clientId = clientId;
  if (search) query.invoiceNumber = { $regex: search, $options: 'i' };

  const skip = (page - 1) * limit;
  const [invoices, total] = await Promise.all([
    Invoice.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Invoice.countDocuments(query),
  ]);

  return { invoices, total };
};

const createInvoice = async (
  freelancerId,
  { clientId, projectId, invoiceNumber, issueDate, dueDate, lineItems, taxPercent = 0, notes, timeLogIds }
) => {
  const client = await Client.findById(clientId);
  // SECURITY [BOLA]: ownership validated
  assertOwnership(client, freelancerId);

  if (projectId) {
    const project = await Project.findById(projectId);
    // SECURITY [BOLA]: ownership validated
    assertOwnership(project, freelancerId);
  }

  if (new Date(dueDate) <= new Date(issueDate)) {
    throw createAppError('Due date must be after issue date', 400);
  }

  if (timeLogIds && timeLogIds.length > 0) {
    const timeLogs = await TimeLog.find({ _id: { $in: timeLogIds } });
    timeLogs.forEach((log) => {
      assertOwnership(log, freelancerId);
      if (log.status === 'Locked') {
        // EDGE CASE [TC-EC-036]: locked time log cannot be invoiced
        throw createAppError(`TimeLog ${log._id} is locked and cannot be added to a new invoice`, 400);
      }
    });
  }

  let finalInvoiceNumber = invoiceNumber;
  if (!finalInvoiceNumber) {
    const count = await Invoice.countDocuments({ freelancerId });
    finalInvoiceNumber = `INV-${String(count + 1).padStart(3, '0')}`;
  }

  // RULE [BR-07]: invoice totals computed from line items
  const lineItemsWithTotals = lineItems.map((item) => ({
    description: item.description.trim(),
    quantity: item.quantity,
    rate: item.rate,
    total: calculateLineItemTotal(item.quantity, item.rate),
  }));

  const subtotal = calculateSubtotal(lineItemsWithTotals);
  const totalAmount = calculateTotalAmount(subtotal, taxPercent || 0);

  try {
    const invoice = await Invoice.create({
      freelancerId,
      clientId,
      projectId: projectId || null,
      invoiceNumber: finalInvoiceNumber,
      status: 'Draft',
      issueDate,
      dueDate,
      taxPercent,
      subtotal,
      totalAmount,
      notes: (notes || '').trim(),
    });

    await InvoiceLineItem.insertMany(
      lineItemsWithTotals.map((item) => ({
        invoiceId: invoice._id,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        total: item.total,
      }))
    );

    if (timeLogIds && timeLogIds.length > 0) {
      await TimeLog.updateMany({ _id: { $in: timeLogIds } }, { invoiceId: invoice._id });
    }

    return invoice;
  } catch (error) {
    if (error.code === 11000) {
      throw createAppError('Invoice number already exists for this freelancer', 409);
    }
    throw error;
  }
};

const getInvoiceById = async (invoiceId, freelancerId) => {
  const invoice = await Invoice.findById(invoiceId);
  // SECURITY [BOLA]: ownership validated
  assertOwnership(invoice, freelancerId);

  const [lineItems, payments] = await Promise.all([
    InvoiceLineItem.find({ invoiceId: invoice._id }),
    PaymentLedger.find({ invoiceId: invoice._id }),
  ]);

  const balanceDue = calculateBalanceDue(Number(invoice.totalAmount), payments);

  return { invoice, lineItems, payments, balanceDue };
};

const updateInvoice = async (invoiceId, freelancerId, updates) => {
  const invoice = await Invoice.findById(invoiceId);
  // SECURITY [BOLA]: ownership validated
  assertOwnership(invoice, freelancerId);

  // RULE [BR-01]: invoice immutable after Sent
  if (invoice.status !== 'Draft') {
    // EDGE CASE [TC-EC-029]: reject line item edits on sent invoices
    throw createAppError('Invoice is not in Draft status', 400);
  }

  if (updates.issueDate !== undefined) invoice.issueDate = updates.issueDate;
  if (updates.dueDate !== undefined) invoice.dueDate = updates.dueDate;
  if (updates.notes !== undefined) invoice.notes = (updates.notes || '').trim();
  if (updates.taxPercent !== undefined) invoice.taxPercent = updates.taxPercent;

  if (invoice.issueDate && invoice.dueDate && new Date(invoice.dueDate) <= new Date(invoice.issueDate)) {
    throw createAppError('Due date must be after issue date', 400);
  }

  if (updates.lineItems) {
    await InvoiceLineItem.deleteMany({ invoiceId: invoice._id });

    const lineItemsWithTotals = updates.lineItems.map((item) => ({
      description: item.description.trim(),
      quantity: item.quantity,
      rate: item.rate,
      total: calculateLineItemTotal(item.quantity, item.rate),
    }));

    const subtotal = calculateSubtotal(lineItemsWithTotals);
    const totalAmount = calculateTotalAmount(subtotal, invoice.taxPercent || 0);

    invoice.subtotal = subtotal;
    invoice.totalAmount = totalAmount;

    await InvoiceLineItem.insertMany(
      lineItemsWithTotals.map((item) => ({
        invoiceId: invoice._id,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        total: item.total,
      }))
    );
  }

  await invoice.save();
  return invoice;
};

const sendInvoice = async (invoiceId, freelancerId) => {
  const invoice = await Invoice.findById(invoiceId);
  // SECURITY [BOLA]: ownership validated
  assertOwnership(invoice, freelancerId);

  if (invoice.status !== 'Draft') {
    throw createAppError('Invoice is not in Draft status', 400);
  }

  const timeLogs = await TimeLog.find({ invoiceId: invoice._id, status: 'Active' });
  const timeLogIds = timeLogs.map((log) => log._id);

  // RULE [BR-03]: time logs lock on invoice send
  await lockTimeLogs(timeLogIds, invoice._id);

  invoice.status = 'Sent';
  await invoice.save();

  // RULE [BR-05]: audit log required for critical actions
  await AuditLog.create({
    freelancerId,
    entityType: 'Invoice',
    entityId: invoice._id.toString(),
    action: 'INVOICE_SENT',
    performedBy: freelancerId,
  });

  if (timeLogIds.length > 0) {
    // RULE [BR-05]: audit log required for critical actions
    await AuditLog.insertMany(
      timeLogIds.map((timeLogId) => ({
        freelancerId,
        entityType: 'TimeLog',
        entityId: timeLogId.toString(),
        action: 'TIMELOG_LOCKED',
        performedBy: freelancerId,
      }))
    );
  }

  const client = await Client.findById(invoice.clientId);
  if (client) {
    await sendInvoiceEmail(
      client.email,
      'Freelancer',
      invoice.invoiceNumber,
      `${CLIENT_URL}/invoices/${invoice._id}`
    );
  }

  return { _id: invoice._id.toString(), status: invoice.status };
};

const generatePDF = async (invoiceId, freelancerId) => {
  const invoice = await Invoice.findById(invoiceId);
  // SECURITY [BOLA]: ownership validated
  assertOwnership(invoice, freelancerId);

  // RULE [US-014]: PDF only for Sent or later invoices
  if (invoice.status === 'Draft') {
    throw createAppError('PDF only available for Sent or later invoices', 400);
  }

  const [lineItems, payments, client, freelancer] = await Promise.all([
    InvoiceLineItem.find({ invoiceId: invoice._id }),
    PaymentLedger.find({ invoiceId: invoice._id }),
    Client.findById(invoice.clientId),
    require('../models/User').findById(freelancerId),
  ]);

  if (!client || !freelancer) {
    throw createAppError('Not found', 404);
  }

  return generateInvoicePDF({ invoice, lineItems, payments, client, freelancer });
};

const runOverdueDetection = async () => {
  await Invoice.updateMany(
    { dueDate: { $lt: new Date() }, status: { $in: ['Sent', 'Viewed', 'PartiallyPaid'] } },
    { status: 'Overdue' }
  );
};

module.exports = {
  getAllInvoices,
  createInvoice,
  getInvoiceById,
  updateInvoice,
  sendInvoice,
  generatePDF,
  runOverdueDetection,
};
