// User profile and notification preferences.
const User = require('../models/User');

const createAppError = (message, statusCode) => {
  const error = new Error(message);
  error.name = 'AppError';
  error.statusCode = statusCode;
  return error;
};

const getSettings = async (userId) => {
  // SECURITY [BOLA]: user settings scoped by userId
  const user = await User.findById(userId);
  if (!user) {
    throw createAppError('Not found', 404);
  }

  return {
    profile: {
      name: user.name,
      email: user.email,
      company: user.company || '',
    },
    notifications: user.notificationPreferences,
  };
};

const updateSettings = async (userId, { name, company, notifications }) => {
  // SECURITY [BOLA]: user settings scoped by userId
  const user = await User.findById(userId);
  if (!user) {
    throw createAppError('Not found', 404);
  }

  if (name !== undefined) user.name = name.trim();
  if (company !== undefined) user.company = (company || '').trim();
  if (notifications) {
    user.notificationPreferences = {
      ...user.notificationPreferences,
      ...notifications,
    };
  }

  await user.save();

  return {
    profile: {
      name: user.name,
      email: user.email,
      company: user.company || '',
    },
    notifications: user.notificationPreferences,
  };
};

module.exports = { getSettings, updateSettings };
