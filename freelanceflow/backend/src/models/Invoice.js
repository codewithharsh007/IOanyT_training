// Invoice schema for billing records.
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', default: null, index: true },
    invoiceNumber: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['Draft', 'Sent', 'Viewed', 'PartiallyPaid', 'Paid', 'Overdue'],
      default: 'Draft',
    },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    taxPercent: { type: mongoose.Schema.Types.Decimal128, required: true, default: 0 },
    subtotal: { type: mongoose.Schema.Types.Decimal128, required: true, default: 0 },
    totalAmount: { type: mongoose.Schema.Types.Decimal128, required: true, default: 0 },
    notes: { type: String, maxlength: 1000, default: '' },
  },
  { timestamps: true }
);

invoiceSchema.index({ freelancerId: 1, invoiceNumber: 1 }, { unique: true });
invoiceSchema.index({ status: 1 });
invoiceSchema.index({ dueDate: 1 });
invoiceSchema.index({ freelancerId: 1, clientId: 1 });

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
