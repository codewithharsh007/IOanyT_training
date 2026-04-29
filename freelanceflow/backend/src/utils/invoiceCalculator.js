// Pure invoice calculation helpers.
const roundTo2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

const calculateLineItemTotal = (quantity, rate) => roundTo2(Number(quantity) * Number(rate));

const calculateSubtotal = (lineItems) =>
  roundTo2(lineItems.reduce((sum, item) => sum + calculateLineItemTotal(item.quantity, item.rate), 0));

const calculateTotalAmount = (subtotal, taxPercent) =>
  roundTo2(Number(subtotal) * (1 + Number(taxPercent) / 100));

const calculateBalanceDue = (totalAmount, paymentsArray) => {
  const paymentsSum = paymentsArray.reduce((sum, payment) => sum + Number(payment.amount), 0);
  return roundTo2(Number(totalAmount) - paymentsSum);
};

const determineInvoiceStatus = (totalAmount, paymentsSum, dueDate, currentStatus) => {
  if (paymentsSum >= totalAmount) return 'Paid';
  if (paymentsSum > 0 && paymentsSum < totalAmount) return 'PartiallyPaid';
  if (dueDate && new Date(dueDate) < new Date()) return 'Overdue';
  return currentStatus;
};

module.exports = {
  calculateLineItemTotal,
  calculateSubtotal,
  calculateTotalAmount,
  calculateBalanceDue,
  determineInvoiceStatus,
};
