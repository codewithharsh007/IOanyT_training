// Integration tests for auth routes.
const request = require('supertest');
const { connectTestDb, clearTestDb, closeTestDb } = require('../helpers/testDb');

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

describe('Auth routes', () => {
  test('POST /api/auth/register registers a user', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Jane Doe',
      email: 'jane@test.com',
      password: 'SecurePass123!'
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
