// Unit tests for invoiceCalculator utilities.
const {
  calculateLineItemTotal,
  calculateSubtotal,
  calculateTotalAmount,
  calculateBalanceDue,
  determineInvoiceStatus,
} = require('../../src/utils/invoiceCalculator');

describe('invoiceCalculator', () => {
  test('calculateLineItemTotal returns rounded total', () => {
    expect(calculateLineItemTotal(3, 33.33)).toBe(99.99);
  });

  test('calculateSubtotal sums line items', () => {
    const subtotal = calculateSubtotal([
      { quantity: 2, rate: 10 },
      { quantity: 1, rate: 15 },
    ]);
    expect(subtotal).toBe(35);
  });

  test('calculateTotalAmount applies tax', () => {
    expect(calculateTotalAmount(100, 10)).toBe(110);
  });

  test('calculateBalanceDue subtracts payments', () => {
    const balance = calculateBalanceDue(200, [{ amount: 50 }, { amount: 75 }]);
    expect(balance).toBe(75);
  });

  test('determineInvoiceStatus returns Paid when fully paid', () => {
    expect(determineInvoiceStatus(100, 100, new Date(), 'Sent')).toBe('Paid');
  });

  test('determineInvoiceStatus returns PartiallyPaid when partial', () => {
    expect(determineInvoiceStatus(100, 50, new Date(), 'Sent')).toBe('PartiallyPaid');
  });
});
