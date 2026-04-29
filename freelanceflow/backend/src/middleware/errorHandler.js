// Global error handler.
const { errorResponse } = require('../utils/response');
const { logger } = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Server error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.message;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate key error';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err.name === 'AppError') {
    statusCode = err.statusCode || 500;
    message = err.message || 'Server error';
  }

  if (statusCode === 500) {
    logger.error(err.stack || err.message || 'Unhandled error');
  }

  return errorResponse(res, statusCode, message, err.message || err);
};

module.exports = { errorHandler };
