// Centralized environment configuration.
const dotenv = require('dotenv');

dotenv.config();

const PORT = Number(process.env.PORT || 5000);
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
const NODE_ENV = process.env.NODE_ENV || 'development';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const SERVER_URL = process.env.SERVER_URL || `http://localhost:${PORT}`;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM;
const INVITE_TOKEN_EXPIRES_HOURS = Number(process.env.INVITE_TOKEN_EXPIRES_HOURS || 48);
const EMAIL_VERIFICATION_EXPIRES_HOURS = Number(process.env.EMAIL_VERIFICATION_EXPIRES_HOURS || 24);
const PASSWORD_RESET_EXPIRES_HOURS = Number(process.env.PASSWORD_RESET_EXPIRES_HOURS || 1);

module.exports = {
  PORT,
  MONGODB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  BCRYPT_SALT_ROUNDS,
  NODE_ENV,
  CLIENT_URL,
  SERVER_URL,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM,
  INVITE_TOKEN_EXPIRES_HOURS,
  EMAIL_VERIFICATION_EXPIRES_HOURS,
  PASSWORD_RESET_EXPIRES_HOURS,
};
