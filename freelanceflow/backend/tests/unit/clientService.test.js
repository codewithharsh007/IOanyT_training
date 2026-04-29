// Unit tests for clientService.
const clientService = require('../../src/services/clientService');
const { connectTestDb, clearTestDb, closeTestDb } = require('../helpers/testDb');
const { createTestUser } = require('../helpers/testFactories');

beforeAll(async () => {
  await connectTestDb();
});

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await closeTestDb();
});

describe('clientService', () => {
  test('createClient creates a client record', async () => {
    const user = await createTestUser();
    const client = await clientService.createClient(user._id.toString(), {
      name: 'Acme Corp',
      email: 'acme@test.com',
      company: 'Acme',
      phone: '123',
      notes: 'Notes',
    });

    expect(client.email).toBe('acme@test.com');
  });
});
