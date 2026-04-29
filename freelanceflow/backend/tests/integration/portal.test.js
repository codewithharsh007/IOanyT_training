// Integration tests for portal routes.
const request = require('supertest');
const { connectTestDb, clearTestDb, closeTestDb } = require('../helpers/testDb');
const { createTestUser, createTestClient } = require('../helpers/testFactories');
const { signAccessToken } = require('../../src/utils/tokenUtils');
const User = require('../../src/models/User');

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

describe('Portal routes', () => {
  test('GET /api/portal/invoices returns client invoices', async () => {
    const freelancer = await createTestUser();
    const client = await createTestClient(freelancer._id);

    const portalUser = await User.create({
      name: 'Client User',
      email: client.email,
      passwordHash: freelancer.passwordHash,
      role: 'client',
      isEmailVerified: true,
      clientId: client._id,
      freelancerId: freelancer._id,
    });

    const portalToken = signAccessToken({
      userId: portalUser._id.toString(),
      email: portalUser.email,
      role: 'client',
      clientId: client._id.toString(),
      freelancerId: freelancer._id.toString(),
    });

    const response = await request(app)
      .get('/api/portal/invoices')
      .set('Authorization', `Bearer ${portalToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
