// Daily overdue invoice detection job.
const cron = require('node-cron');
const { runOverdueDetection } = require('../services/invoiceService');
const { logger } = require('../utils/logger');

const initOverdueJob = () => {
  cron.schedule('5 0 * * *', async () => {
    try {
      await runOverdueDetection();
      logger.info('Overdue detection job completed');
    } catch (error) {
      logger.error(`Overdue detection job failed: ${error.message}`);
    }
  });
};

module.exports = { initOverdueJob };
