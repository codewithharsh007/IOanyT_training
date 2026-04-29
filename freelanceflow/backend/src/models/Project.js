// Project schema for freelancer-managed work.
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true, index: true },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    description: { type: String, maxlength: 500, default: '' },
    status: {
      type: String,
      required: true,
      enum: ['Active', 'Draft', 'OnHold', 'Completed', 'Archived'],
      default: 'Draft',
    },
    startDate: { type: Date, default: null },
    deadline: { type: Date, default: null },
    budget: { type: mongoose.Schema.Types.Decimal128, min: 0, default: null },
    hourlyRate: { type: mongoose.Schema.Types.Decimal128, min: 0, default: null },
  },
  { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
