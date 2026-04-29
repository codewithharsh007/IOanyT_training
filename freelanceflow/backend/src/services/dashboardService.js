// Dashboard metrics aggregation.
const Invoice = require('../models/Invoice');
const Project = require('../models/Project');
const PaymentLedger = require('../models/PaymentLedger');

const getMetrics = async (freelancerId) => {
  // RULE [US-015]: dashboard metrics scoped by freelancerId
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const paymentsThisMonth = await PaymentLedger.aggregate([
    { $match: { freelancerId: freelancerId, recordedAt: { $gte: startOfMonth } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  const earningsByMonthAgg = await PaymentLedger.aggregate([
    { $match: { freelancerId: freelancerId, recordedAt: { $gte: startOfYear } } },
    {
      $group: {
        _id: { $month: '$recordedAt' },
        amount: { $sum: '$amount' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const earningsByMonth = earningsByMonthAgg.map((entry) => ({
    month: entry._id,
    amount: Number(entry.amount),
  }));

  const outstandingStatuses = ['Sent', 'Viewed', 'PartiallyPaid', 'Overdue'];
  const [outstandingInvoices, overdueCount, activeProjectsCount, recentInvoices] = await Promise.all([
    Invoice.find({ freelancerId, status: { $in: outstandingStatuses } }),
    Invoice.countDocuments({ freelancerId, status: 'Overdue' }),
    Project.countDocuments({ freelancerId, status: 'Active' }),
    // NOTE: not in structure files — defaulted to 5 recent invoices.
    Invoice.find({ freelancerId }).sort({ createdAt: -1 }).limit(5),
  ]);

  const outstandingInvoicesCount = outstandingInvoices.length;
  const outstandingInvoicesTotal = outstandingInvoices.reduce(
    (sum, invoice) => sum + Number(invoice.totalAmount),
    0
  );

  return {
    totalEarningsThisMonth: paymentsThisMonth[0] ? Number(paymentsThisMonth[0].total) : 0,
    earningsByMonth,
    outstandingInvoicesCount,
    outstandingInvoicesTotal,
    overdueCount,
    activeProjectsCount,
    recentInvoices,
  };
};

module.exports = { getMetrics };
