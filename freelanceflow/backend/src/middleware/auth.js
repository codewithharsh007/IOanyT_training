// Auth middleware for JWT verification and role checks.
const { verifyAccessToken } = require('../utils/tokenUtils');
const { errorResponse } = require('../utils/response');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return errorResponse(res, 401, 'No token provided');
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      clientId: decoded.clientId,
      freelancerId: decoded.freelancerId,
    };
    return next();
  } catch (error) {
    return errorResponse(res, 401, error.message || 'Invalid token');
  }
};

const clientOnly = (req, res, next) => {
  if (req.user?.role !== 'client') {
    return errorResponse(res, 403, 'Forbidden');
  }
  return next();
};

const freelancerOnly = (req, res, next) => {
  if (req.user?.role !== 'freelancer') {
    return errorResponse(res, 403, 'Forbidden');
  }
  return next();
};

module.exports = { protect, clientOnly, freelancerOnly };
