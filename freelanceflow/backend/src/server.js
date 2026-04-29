// Server entry point.
const app = require('./app');
const { connectDB } = require('./config/db');
const { PORT } = require('./config/constants');
const { initOverdueJob } = require('./jobs/overdueDetectionJob');
const { logger } = require('./utils/logger');

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });

  initOverdueJob();
};

startServer();
