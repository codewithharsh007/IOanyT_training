// Integration tests for payment routes.
const request = require('supertest');
const { connectTestDb, clearTestDb, closeTestDb } = require('../helpers/testDb');
const { createTestUser, createTestClient } = require('../helpers/testFactories');
const { signAccessToken } = require('../../src/utils/tokenUtils');

let app;

beforeAll(async () => {
  process.env.JWT_SECRET = 'testsecretkey_testsecretkey_testsecretkey';
  app = require('../../src/app');
  await connectTestDb();
});

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await closeTestDb();
});

describe('Payment routes', () => {
  test('POST /api/invoices/:id/payments records a payment', async () => {
    const user = await createTestUser();
    const client = await createTestClient(user._id);
    const token = signAccessToken({ userId: user._id.toString(), email: user.email, role: 'freelancer' });

    const invoiceResponse = await request(app)
      .post('/api/invoices')
      .set('Authorization', `Bearer ${token}`)
      .send({
        clientId: client._id.toString(),
        issueDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        lineItems: [{ description: 'Work', quantity: 1, rate: 100 }]
      });

    const invoiceId = invoiceResponse.body.data._id;

    await request(app)
      .patch(`/api/invoices/${invoiceId}/send`)
      .set('Authorization', `Bearer ${token}`)
      .send();

    const paymentResponse = await request(app)
      .post(`/api/invoices/${invoiceId}/payments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 50 });

    expect(paymentResponse.status).toBe(201);
    expect(paymentResponse.body.success).toBe(true);
  });
});
