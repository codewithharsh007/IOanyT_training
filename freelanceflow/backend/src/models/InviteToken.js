// Invite token schema for client portal access.
const mongoose = require('mongoose');

const inviteTokenSchema = new mongoose.Schema(
  {
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    status: { type: String, required: true, enum: ['Active', 'Expired', 'Redeemed'], default: 'Active' },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

inviteTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const InviteToken = mongoose.model('InviteToken', inviteTokenSchema);

module.exports = InviteToken;
