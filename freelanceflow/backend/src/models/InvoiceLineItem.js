// Invoice line item schema.
const mongoose = require('mongoose');

const invoiceLineItemSchema = new mongoose.Schema(
  {
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', required: true, index: true },
    description: { type: String, required: true, trim: true, minlength: 1, maxlength: 200 },
    quantity: { type: mongoose.Schema.Types.Decimal128, required: true, min: 0.01 },
    rate: { type: mongoose.Schema.Types.Decimal128, required: true, min: 0 },
    total: { type: mongoose.Schema.Types.Decimal128, required: true, min: 0 },
  },
  { timestamps: false }
);

const InvoiceLineItem = mongoose.model('InvoiceLineItem', invoiceLineItemSchema);

module.exports = InvoiceLineItem;
