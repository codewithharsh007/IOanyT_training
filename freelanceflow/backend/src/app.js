// Express application setup.
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const { authRateLimiter, globalRateLimiter } = require('./middleware/rateLimiter');
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const projectRoutes = require('./routes/projectRoutes');
const timeLogRoutes = require('./routes/timeLogRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const auditRoutes = require('./routes/auditRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const portalRoutes = require('./routes/portalRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const { errorResponse } = require('./utils/response');
const { CLIENT_URL, NODE_ENV } = require('./config/constants');

const app = express();
const allowedOrigins = [CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'].filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());

if (NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// SECURITY [RATE-LIMIT]: brute force protection
app.use('/api/auth', authRateLimiter);
app.use('/api', globalRateLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/time-logs', timeLogRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/portal', portalRoutes);

app.use((req, res) => errorResponse(res, 404, 'Route not found'));
app.use(errorHandler);

module.exports = app;
