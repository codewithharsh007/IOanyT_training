// Audit log schema for immutable events.
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    entityType: {
      type: String,
      required: true,
      enum: ['Invoice', 'Payment', 'Client', 'TimeLog', 'InviteToken'],
    },
    entityId: { type: String, required: true },
    action: {
      type: String,
      required: true,
      enum: ['INVOICE_SENT', 'PAYMENT_RECORDED', 'CLIENT_INVITED', 'INVOICE_VIEWED', 'TIMELOG_LOCKED', 'INVITE_ACCEPTED'],
    },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, required: true, default: Date.now, immutable: true },
  },
  { timestamps: false }
);

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
