// Authentication and session logic.
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const InviteToken = require('../models/InviteToken');
const Client = require('../models/Client');
const {
  BCRYPT_SALT_ROUNDS,
  EMAIL_VERIFICATION_EXPIRES_HOURS,
  PASSWORD_RESET_EXPIRES_HOURS,
  CLIENT_URL,
  SERVER_URL,
} = require('../config/constants');
const { generateRandomToken, hashToken, signAccessToken } = require('../utils/tokenUtils');
const { sendEmailVerification, sendPasswordReset } = require('./emailService');

const createAppError = (message, statusCode) => {
  const error = new Error(message);
  error.name = 'AppError';
  error.statusCode = statusCode;
  return error;
};

const registerUser = async (name, email, password) => {
  // RULE [US-001]: email must be unique globally
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    // EDGE CASE [TC-002]: reject duplicate email
    throw createAppError('Email already registered', 409);
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const rawVerificationToken = generateRandomToken();
  const verificationTokenHash = hashToken(rawVerificationToken);
  const verificationExpires = new Date(Date.now() + EMAIL_VERIFICATION_EXPIRES_HOURS * 60 * 60 * 1000);

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    passwordHash,
    isEmailVerified: false,
    emailVerificationToken: verificationTokenHash,
    emailVerificationExpires: verificationExpires,
  });

  await sendEmailVerification(user.email, `${SERVER_URL}/api/auth/verify-email?token=${rawVerificationToken}`);

  return { userId: user._id.toString(), name: user.name, email: user.email };
};

const verifyEmail = async (rawToken) => {
  const tokenHash = hashToken(rawToken);
  const user = await User.findOne({
    emailVerificationToken: tokenHash,
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    throw createAppError('Invalid or expired token', 400);
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = null;
  user.emailVerificationExpires = null;
  await user.save();
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw createAppError('Invalid credentials', 401);
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    throw createAppError('Invalid credentials', 401);
  }

  // RULE [US-001]: email verification required before activation
  if (!user.isEmailVerified) {
    // EDGE CASE [TC-005]: unverified user login rejected
    throw createAppError('Please verify your email before logging in', 403);
  }

  // SECURITY: userId from verified JWT — never from req.body
  const accessToken = signAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    clientId: user.clientId ? user.clientId.toString() : undefined,
    freelancerId: user.freelancerId ? user.freelancerId.toString() : undefined,
  });

  const rawRefreshToken = generateRandomToken();
  const refreshTokenHash = hashToken(rawRefreshToken);

  await RefreshToken.create({
    userId: user._id,
    tokenHash: refreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken,
    refreshToken: rawRefreshToken,
    user: {
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const refreshTokens = async (rawRefreshToken) => {
  if (!rawRefreshToken) {
    throw createAppError('Refresh token required', 401);
  }

  const tokenHash = hashToken(rawRefreshToken);
  const existingToken = await RefreshToken.findOne({ tokenHash, isRevoked: false });

  if (!existingToken || existingToken.expiresAt <= new Date()) {
    throw createAppError('Invalid or expired refresh token', 401);
  }

  // RULE [US-002]: refresh token rotation invalidates previous token
  existingToken.isRevoked = true;
  await existingToken.save();

  const user = await User.findById(existingToken.userId);
  if (!user) {
    throw createAppError('Invalid or expired refresh token', 401);
  }

  // SECURITY: userId from verified JWT — never from req.body
  const accessToken = signAccessToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    clientId: user.clientId ? user.clientId.toString() : undefined,
    freelancerId: user.freelancerId ? user.freelancerId.toString() : undefined,
  });

  const newRawRefreshToken = generateRandomToken();
  const newTokenHash = hashToken(newRawRefreshToken);

  await RefreshToken.create({
    userId: user._id,
    tokenHash: newTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken: newRawRefreshToken };
};

const logout = async (userId, rawRefreshToken) => {
  if (!rawRefreshToken) {
    return;
  }
  const tokenHash = hashToken(rawRefreshToken);
  await RefreshToken.updateOne({ userId, tokenHash }, { isRevoked: true });
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return;
  }

  const rawResetToken = generateRandomToken();
  const resetTokenHash = hashToken(rawResetToken);

  user.passwordResetToken = resetTokenHash;
  user.passwordResetExpires = new Date(Date.now() + PASSWORD_RESET_EXPIRES_HOURS * 60 * 60 * 1000);
  await user.save();

  await sendPasswordReset(user.email, `${SERVER_URL}/api/auth/reset-password?token=${rawResetToken}`);
};

const resetPassword = async (rawToken, newPassword) => {
  const tokenHash = hashToken(rawToken);
  const user = await User.findOne({
    passwordResetToken: tokenHash,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    throw createAppError('Invalid or expired token', 400);
  }

  user.passwordHash = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
  user.passwordResetToken = null;
  user.passwordResetExpires = null;
  await user.save();
};

const acceptClientInvite = async (rawToken, password) => {
  const tokenHash = hashToken(rawToken);
  const invite = await InviteToken.findOne({ tokenHash, status: 'Active', expiresAt: { $gt: new Date() } });

  if (!invite) {
    // EDGE CASE [TC-014]: expired invite token rejected
    throw createAppError('Invite token is expired or invalid', 400);
  }

  const existingPortalUser = await User.findOne({ clientId: invite.clientId });
  if (existingPortalUser) {
    // EDGE CASE [TC-015]: redeemed invite token cannot be reused
    throw createAppError('Invite token is expired or invalid', 400);
  }

  const client = await Client.findById(invite.clientId);
  if (!client) {
    throw createAppError('Invite token is expired or invalid', 400);
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const portalUser = await User.create({
    name: client.name,
    email: client.email,
    passwordHash,
    role: 'client',
    isEmailVerified: true,
    clientId: client._id,
    freelancerId: invite.freelancerId,
  });

  // RULE [US-005]: redeemed tokens cannot be reused
  invite.status = 'Redeemed';
  await invite.save();

  const accessToken = signAccessToken({
    userId: portalUser._id.toString(),
    email: portalUser.email,
    role: portalUser.role,
    clientId: portalUser.clientId.toString(),
    freelancerId: portalUser.freelancerId.toString(),
  });

  const rawRefreshToken = generateRandomToken();
  const refreshTokenHash = hashToken(rawRefreshToken);

  await RefreshToken.create({
    userId: portalUser._id,
    tokenHash: refreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken,
    refreshToken: rawRefreshToken,
    user: {
      userId: portalUser._id.toString(),
      name: portalUser.name,
      email: portalUser.email,
      role: portalUser.role,
      clientId: portalUser.clientId.toString(),
      freelancerId: portalUser.freelancerId.toString(),
    },
  };
};

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  refreshTokens,
  logout,
  forgotPassword,
  resetPassword,
  acceptClientInvite,
};
