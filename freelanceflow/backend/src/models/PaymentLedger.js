// Payment ledger schema for append-only payments.
const mongoose = require('mongoose');

const paymentLedgerSchema = new mongoose.Schema(
  {
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true, index: true },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: mongoose.Schema.Types.Decimal128, required: true, min: 0.01 },
    method: {
      type: String,
      required: true,
      enum: ['manual', 'bank_transfer', 'cash', 'cheque'],
      default: 'manual',
    },
    notes: { type: String, maxlength: 500, default: '' },
    recordedAt: { type: Date, required: true, default: Date.now, immutable: true },
    recordedBy: { type: String, required: true, enum: ['freelancer', 'system'], default: 'freelancer' },
  },
  { timestamps: false }
);

const PaymentLedger = mongoose.model('PaymentLedger', paymentLedgerSchema);

module.exports = PaymentLedger;
