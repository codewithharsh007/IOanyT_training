// Integration tests for time log routes.
const request = require('supertest');
const { connectTestDb, clearTestDb, closeTestDb } = require('../helpers/testDb');
const { createTestUser, createTestClient, createTestProject } = require('../helpers/testFactories');
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

describe('Time log routes', () => {
  test('POST /api/time-logs creates a time log', async () => {
    const user = await createTestUser();
    const client = await createTestClient(user._id);
    const project = await createTestProject(user._id, client._id);
    const token = signAccessToken({ userId: user._id.toString(), email: user.email, role: 'freelancer' });

    const response = await request(app)
      .post('/api/time-logs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        projectId: project._id.toString(),
        date: new Date().toISOString(),
        hours: 1,
        minutes: 30,
        description: 'Work'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
