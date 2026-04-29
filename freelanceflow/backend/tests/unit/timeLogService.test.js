// Unit tests for timeLogService.
const timeLogService = require('../../src/services/timeLogService');
const { connectTestDb, clearTestDb, closeTestDb } = require('../helpers/testDb');
const { createTestUser, createTestClient, createTestProject } = require('../helpers/testFactories');

beforeAll(async () => {
  await connectTestDb();
});

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await closeTestDb();
});

describe('timeLogService', () => {
  test('createTimeLog creates a time log entry', async () => {
    const user = await createTestUser();
    const client = await createTestClient(user._id);
    const project = await createTestProject(user._id, client._id);

    const timeLog = await timeLogService.createTimeLog(user._id.toString(), {
      projectId: project._id.toString(),
      date: new Date().toISOString(),
      hours: 2,
      minutes: 30,
      description: 'UI work',
    });

    expect(timeLog.status).toBe('Active');
  });
});
