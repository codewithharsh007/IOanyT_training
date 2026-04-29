// Rate limiter instances for route groups.
const rateLimit = require('express-rate-limit');

const limiterHandler = (req, res) => {
  res.status(429).json({ success: false, message: 'Too many requests — please try again later' });
};

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limiterHandler,
});

const registerRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limiterHandler,
});

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limiterHandler,
});

const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: limiterHandler,
});

module.exports = {
  loginRateLimiter,
  registerRateLimiter,
  authRateLimiter,
  globalRateLimiter,
};
