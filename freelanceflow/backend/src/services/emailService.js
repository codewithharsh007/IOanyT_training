// SMTP email helpers for transactional messages.
const nodemailer = require('nodemailer');
const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM } = require('../config/constants');
const { logger } = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({ from: EMAIL_FROM, to, subject, html });
  } catch (error) {
    logger.error(`Email send failed: ${error.message}`);
  }
};

const sendEmailVerification = async (to, verificationUrl) => {
  await sendEmail({
    to,
    subject: 'Verify your email',
    html: `<p>Please verify your email by clicking <a href="${verificationUrl}">this link</a>.</p>`,
  });
};

const sendPasswordReset = async (to, resetUrl) => {
  await sendEmail({
    to,
    subject: 'Reset your password',
    html: `<p>Reset your password by clicking <a href="${resetUrl}">this link</a>.</p>`,
  });
};

const sendInvoiceEmail = async (to, freelancerName, invoiceNumber, portalUrl) => {
  await sendEmail({
    to,
    subject: `Invoice ${invoiceNumber} from ${freelancerName}`,
    html: `<p>You have a new invoice. View it here: <a href="${portalUrl}">${portalUrl}</a></p>`,
  });
};

const sendInviteEmail = async (to, freelancerName, inviteUrl) => {
  await sendEmail({
    to,
    subject: `${freelancerName} invited you to FreelanceFlow`,
    html: `<p>You have been invited to the client portal. Accept here: <a href="${inviteUrl}">${inviteUrl}</a></p>`,
  });
};

module.exports = {
  sendEmailVerification,
  sendPasswordReset,
  sendInvoiceEmail,
  sendInviteEmail,
};
