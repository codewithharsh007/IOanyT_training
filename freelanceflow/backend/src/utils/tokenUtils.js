// Token utilities for random tokens and JWTs.
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/constants');

const generateRandomToken = () => crypto.randomBytes(32).toString('hex');

const hashToken = (rawToken) =>
  crypto.createHash('sha256').update(rawToken).digest('hex');

const signAccessToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const verifyAccessToken = (token) => jwt.verify(token, JWT_SECRET);

module.exports = {
  generateRandomToken,
  hashToken,
  signAccessToken,
  verifyAccessToken,
};
