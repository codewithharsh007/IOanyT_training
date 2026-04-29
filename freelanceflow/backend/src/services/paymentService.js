// Payment recording and invoice status recalculation.
const PaymentLedger = require('../models/PaymentLedger');
const Invoice = require('../models/Invoice');
const AuditLog = require('../models/AuditLog');
const { determineInvoiceStatus } = require('../utils/invoiceCalculator');
const { assertOwnership } = require('../middleware/ownershipCheck');

const createAppError = (message, statusCode) => {
  const error = new Error(message);
  error.name = 'AppError';
  error.statusCode = statusCode;
  return error;
};

const recordPayment = async (invoiceId, freelancerId, { amount, method = 'manual', notes }) => {
  const invoice = await Invoice.findById(invoiceId);
  // SECURITY [BOLA]: ownership validated
  assertOwnership(invoice, freelancerId);

  if (!['Sent', 'Viewed', 'PartiallyPaid', 'Overdue'].includes(invoice.status)) {
    throw createAppError('Payments can only be recorded on Sent or later invoices', 400);
  }

  const payments = await PaymentLedger.find({ invoiceId: invoice._id });
  const paymentsSum = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const totalAmount = Number(invoice.totalAmount);

  // RULE [BR-04]: overpayment forbidden
  if (paymentsSum + Number(amount) > totalAmount) {
    // EDGE CASE [TC-EC-032]: reject payments exceeding remaining balance
    const remaining = Math.max(0, totalAmount - paymentsSum).toFixed(2);
    throw createAppError(`Payment would exceed invoice total. Maximum allowed: $${remaining}`, 400);
  }

  // RULE [BR-02]: payments are append-only
  const payment = await PaymentLedger.create({
    invoiceId: invoice._id,
    freelancerId,
    amount,
    method,
    notes: (notes || '').trim(),
  });

  const newPaymentsSum = paymentsSum + Number(amount);
  invoice.status = determineInvoiceStatus(totalAmount, newPaymentsSum, invoice.dueDate, invoice.status);
  await invoice.save();

  // RULE [BR-05]: audit log required for critical actions
  await AuditLog.create({
    freelancerId,
    entityType: 'Payment',
    entityId: payment._id.toString(),
    action: 'PAYMENT_RECORDED',
    performedBy: freelancerId,
    metadata: { invoiceId: invoice._id.toString(), amount },
  });

  return { payment, updatedInvoiceStatus: invoice.status };
};

module.exports = { recordPayment };
