// Integration tests for project routes.
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

describe('Project routes', () => {
  test('POST /api/projects creates a project', async () => {
    const user = await createTestUser();
    const client = await createTestClient(user._id);
    const token = signAccessToken({ userId: user._id.toString(), email: user.email, role: 'freelancer' });

    const response = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Project', clientId: client._id.toString(), status: 'Draft' });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
