// Integration tests for client routes.
const request = require('supertest');
const { connectTestDb, clearTestDb, closeTestDb } = require('../helpers/testDb');
const { createTestUser } = require('../helpers/testFactories');
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

describe('Client routes', () => {
  test('POST /api/clients creates a client', async () => {
    const user = await createTestUser();
    const token = signAccessToken({ userId: user._id.toString(), email: user.email, role: 'freelancer' });

    const response = await request(app)
      .post('/api/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Acme', email: 'acme@test.com' });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
