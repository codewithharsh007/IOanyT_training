// Client schema for freelancer-owned clients.
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    company: { type: String, maxlength: 100, default: '' },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    notes: { type: String, maxlength: 500, default: '' },
    status: { type: String, required: true, enum: ['Active', 'Archived'], default: 'Active' },
  },
  { timestamps: true }
);

clientSchema.index({ freelancerId: 1, email: 1 }, { unique: true });
clientSchema.index({ status: 1 });

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
