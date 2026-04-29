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

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    await transporter.sendMail({ from: EMAIL_FROM, to, subject, text, html });
  } catch (error) {
    logger.error(`Email send failed: ${error.message}`);
  }
};

const sendEmailVerification = async (to, verificationUrl) => {
  const html = `
    <div>
      <p>Please verify your email by clicking <a href="${verificationUrl}">this link</a>.</p>
      <p>If the button above does not work, copy and paste the following URL into your browser:</p>
      <p><a href="${verificationUrl}">${verificationUrl}</a></p>
    </div>
  `;
  const text = `Please verify your email by visiting: ${verificationUrl}`;

  await sendEmail({
    to,
    subject: 'Verify your email',
    text,
    html,
  });
};

const sendPasswordReset = async (to, resetUrl) => {
  const html = `
    <div>
      <p>Reset your password by clicking <a href="${resetUrl}">this link</a>.</p>
      <p>If the button above does not work, copy and paste the following URL into your browser:</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
    </div>
  `;
  const text = `Reset your password by visiting: ${resetUrl}`;

  await sendEmail({
    to,
    subject: 'Reset your password',
    text,
    html,
  });
};

const sendInvoiceEmail = async (to, freelancerName, invoiceNumber, portalUrl) => {
  const html = `<p>You have a new invoice. View it here: <a href="${portalUrl}">${portalUrl}</a></p>`;
  const text = `You have a new invoice. View it here: ${portalUrl}`;

  await sendEmail({
    to,
    subject: `Invoice ${invoiceNumber} from ${freelancerName}`,
    text,
    html,
  });
};

const sendInviteEmail = async (to, freelancerName, inviteUrl) => {
  const html = `<p>You have been invited to the client portal. Accept here: <a href="${inviteUrl}">${inviteUrl}</a></p>`;
  const text = `You have been invited to the client portal. Accept here: ${inviteUrl}`;

  await sendEmail({
    to,
    subject: `${freelancerName} invited you to FreelanceFlow`,
    text,
    html,
  });
};

module.exports = {
  sendEmailVerification,
  sendPasswordReset,
  sendInvoiceEmail,
  sendInviteEmail,
};
