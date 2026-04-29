// Time log schema for tracked work.
const mongoose = require('mongoose');

const timeLogSchema = new mongoose.Schema(
  {
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    date: { type: Date, required: true },
    hours: { type: Number, required: true, min: 0, max: 23 },
    minutes: { type: Number, required: true, min: 0, max: 59 },
    description: { type: String, maxlength: 500, default: '' },
    status: { type: String, required: true, enum: ['Active', 'Locked'], default: 'Active' },
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', default: null },
  },
  { timestamps: true }
);

const TimeLog = mongoose.model('TimeLog', timeLogSchema);

module.exports = TimeLog;
