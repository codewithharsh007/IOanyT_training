// Standard API response helpers.
const { NODE_ENV } = require('../config/constants');

const successResponse = (res, statusCode, message, data = {}) => {
  res.status(statusCode).json({ success: true, message, data });
};

const errorResponse = (res, statusCode, message, error = null) => {
  const payload = { success: false, message };
  if (NODE_ENV === 'development' && error) {
    payload.error = error;
  }
  res.status(statusCode).json(payload);
};

module.exports = { successResponse, errorResponse };
