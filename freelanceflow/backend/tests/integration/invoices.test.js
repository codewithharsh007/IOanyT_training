// Integration tests for invoice routes.
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

describe('Invoice routes', () => {
  test('POST /api/invoices creates an invoice', async () => {
    const user = await createTestUser();
    const client = await createTestClient(user._id);
    const token = signAccessToken({ userId: user._id.toString(), email: user.email, role: 'freelancer' });

    const response = await request(app)
      .post('/api/invoices')
      .set('Authorization', `Bearer ${token}`)
      .send({
        clientId: client._id.toString(),
        issueDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        lineItems: [{ description: 'Work', quantity: 2, rate: 50 }]
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
