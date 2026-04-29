// Client portal read-only access services.
const Invoice = require('../models/Invoice');
const InvoiceLineItem = require('../models/InvoiceLineItem');
const PaymentLedger = require('../models/PaymentLedger');
const Project = require('../models/Project');
const AuditLog = require('../models/AuditLog');

const createAppError = (message, statusCode) => {
  const error = new Error(message);
  error.name = 'AppError';
  error.statusCode = statusCode;
  return error;
};

const getClientInvoices = async (clientId, freelancerId) => {
  // RULE [BR-06]: client access strictly scoped to clientId + freelancerId
  const invoices = await Invoice.find({ clientId, freelancerId }).sort({ createdAt: -1 });
  return { invoices };
};

const getClientInvoiceById = async (invoiceId, clientId, freelancerId) => {
  // RULE [BR-06]: client access strictly scoped to clientId + freelancerId
  const invoice = await Invoice.findOne({ _id: invoiceId, clientId, freelancerId });
  if (!invoice) {
    throw createAppError('Not found', 404);
  }

  if (invoice.status === 'Sent') {
    // RULE [US-011]: first client view sets invoice to Viewed
    invoice.status = 'Viewed';
    await invoice.save();

    // RULE [BR-05]: audit log required for critical actions
    await AuditLog.create({
      freelancerId,
      entityType: 'Invoice',
      entityId: invoice._id.toString(),
      action: 'INVOICE_VIEWED',
      performedBy: clientId,
    });
  }

  const [lineItems, payments] = await Promise.all([
    InvoiceLineItem.find({ invoiceId: invoice._id }),
    PaymentLedger.find({ invoiceId: invoice._id }),
  ]);

  return { invoice, lineItems, payments };
};

const getClientProjects = async (clientId, freelancerId) => {
  // RULE [BR-06]: client access strictly scoped to clientId + freelancerId
  const projects = await Project.find({ clientId, freelancerId }).sort({ createdAt: -1 });
  return { projects };
};

module.exports = {
  getClientInvoices,
  getClientInvoiceById,
  getClientProjects,
};
