// User schema for freelancers and client portal users.
const mongoose = require('mongoose');

const notificationPreferencesSchema = new mongoose.Schema(
  {
    emailOnInvoiceView: { type: Boolean, default: true },
    emailOnPaymentReceived: { type: Boolean, default: true },
    overdueInvoiceAlerts: { type: Boolean, default: true },
    emailOnTimeLogs: { type: Boolean, default: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, minlength: 60 },
    role: {
      type: String,
      required: true,
      enum: ['freelancer', 'client'],
      default: 'freelancer',
    },
    isEmailVerified: { type: Boolean, required: true, default: false },
    emailVerificationToken: { type: String, default: null },
    emailVerificationExpires: { type: Date, default: null },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', default: null },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    company: { type: String, maxlength: 100, default: '' },
    notificationPreferences: { type: notificationPreferencesSchema, default: () => ({}) },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
