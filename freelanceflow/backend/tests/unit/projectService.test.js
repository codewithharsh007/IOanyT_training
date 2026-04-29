// Unit tests for projectService.
const projectService = require('../../src/services/projectService');
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

describe('projectService', () => {
  test('archiveProject marks status as Archived', async () => {
    const user = await createTestUser();
    const client = await createTestClient(user._id);
    const project = await projectService.createProject(user._id.toString(), {
      name: 'Website',
      clientId: client._id.toString(),
      status: 'Active',
    });

    const archived = await projectService.archiveProject(project._id.toString(), user._id.toString());
    expect(archived.status).toBe('Archived');
  });
});
