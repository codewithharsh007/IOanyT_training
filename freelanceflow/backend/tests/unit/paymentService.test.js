// Unit tests for paymentService.
const paymentService = require('../../src/services/paymentService');
const invoiceService = require('../../src/services/invoiceService');
const { connectTestDb, clearTestDb, closeTestDb } = require('../helpers/testDb');
const { createTestUser, createTestClient } = require('../helpers/testFactories');

beforeAll(async () => {
  await connectTestDb();
});

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await closeTestDb();
});

describe('paymentService', () => {
  test('recordPayment updates invoice status', async () => {
    const user = await createTestUser();
    const client = await createTestClient(user._id);

    const invoice = await invoiceService.createInvoice(user._id.toString(), {
      clientId: client._id.toString(),
      issueDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      lineItems: [{ description: 'Work', quantity: 1, rate: 100 }],
    });

    await invoiceService.sendInvoice(invoice._id.toString(), user._id.toString());
    const result = await paymentService.recordPayment(invoice._id.toString(), user._id.toString(), { amount: 50 });

    expect(result.updatedInvoiceStatus).toBe('PartiallyPaid');
  });
});
